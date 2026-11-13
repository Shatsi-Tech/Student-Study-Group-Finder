const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, postController.createPost);
router.get('/group/:groupId', authenticate, postController.getGroupPosts);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;
