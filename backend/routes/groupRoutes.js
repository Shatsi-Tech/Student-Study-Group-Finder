const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authenticate } = require('../middleware/authMiddleware');

// Public or optionally authenticated to browse
router.get('/', (req, res, next) => {
    // Optional token extraction
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticate(req, res, next);
    }
    next();
}, groupController.getGroups);

router.get('/:id', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticate(req, res, next);
    }
    next();
}, groupController.getGroupById);

// Protected routes
router.post('/', authenticate, groupController.createGroup);
router.put('/:id', authenticate, groupController.updateGroup);
router.delete('/:id', authenticate, groupController.deleteGroup);

// Membership routes
router.post('/:id/join', authenticate, groupController.joinGroup);
router.post('/:id/leave', authenticate, groupController.leaveGroup);
router.delete('/:id/members/:userId', authenticate, groupController.removeMember);

module.exports = router;
