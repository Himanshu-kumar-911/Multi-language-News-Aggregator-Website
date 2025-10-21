import express from 'express';
import { body, validationResult, query } from 'express-validator';
import User from '../models/User.js';
import { requireAdmin, requireSuperAdmin, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', requireAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'admin', 'superadmin']).withMessage('Invalid role filter'),
  query('status').optional().isIn(['active', 'suspended', 'deleted']).withMessage('Invalid status filter'),
  query('search').optional().isLength({ min: 2 }).withMessage('Search term must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.accountStatus = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// Update user role and permissions (admin only)
router.put('/users/:id/role', requireAdmin, [
  body('role').isIn(['user', 'admin', 'superadmin']).withMessage('Invalid role'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array'),
  body('permissions.*').optional().isIn([
    'manage_users', 'manage_news', 'manage_categories', 
    'view_analytics', 'manage_settings', 'moderate_content'
  ]).withMessage('Invalid permission')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { role, permissions = [] } = req.body;
    const targetUserId = req.params.id;

    // Prevent non-superadmin from creating superadmin
    if (role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can assign super admin role'
      });
    }

    // Prevent users from changing their own role
    if (targetUserId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { 
        role, 
        permissions: role === 'superadmin' ? [] : permissions 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

// Update user account status (admin only)
router.put('/users/:id/status', requireAdmin, [
  body('status').isIn(['active', 'suspended', 'deleted']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const targetUserId = req.params.id;

    // Prevent users from changing their own status
    if (targetUserId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own account status'
      });
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { accountStatus: status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User account ${status} successfully`,
      data: { user }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Delete user (super admin only)
router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Prevent super admin from deleting themselves
    if (targetUserId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(targetUserId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Get user statistics (admin only)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await User.getUserStats();
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ accountStatus: 'active' });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        roleBreakdown: stats,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Get admin users (admin only)
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const admins = await User.getAdmins().select('-password');
    
    res.json({
      success: true,
      data: { admins }
    });

  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin users'
    });
  }
});

// Unlock user account (admin only)
router.post('/users/:id/unlock', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.resetLoginAttempts();

    res.json({
      success: true,
      message: 'User account unlocked successfully'
    });

  } catch (error) {
    console.error('Unlock user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlock user account'
    });
  }
});

export default router;
