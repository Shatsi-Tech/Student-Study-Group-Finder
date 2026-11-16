const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// All admin routes require valid JWT and role === 'ADMIN'
router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/groups', adminController.getAllGroups);
router.put('/groups/:id/status', adminController.updateGroupStatus);
router.get('/sessions', adminController.getAllSessions);
router.post('/reset-database', adminController.resetDatabase);

module.exports = router;
