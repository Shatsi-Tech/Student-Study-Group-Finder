import api from './api';

export const postService = {
  async getGroupPosts(groupId) {
    const response = await api.get(`/posts/group/${groupId}`);
    return response.data;
  },

  async createPost(postData) {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  async createComment(postId, content) {
    const response = await api.post('/comments', { post_id: postId, content });
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};
