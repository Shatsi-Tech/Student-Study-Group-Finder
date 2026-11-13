const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, sessionController.createSession);
router.get('/my-upcoming', authenticate, sessionController.getUserUpcomingSessions);
router.get('/group/:groupId', authenticate, sessionController.getGroupSessions);
router.put('/:id/status', authenticate, sessionController.updateSessionStatus);

module.exports = router;
