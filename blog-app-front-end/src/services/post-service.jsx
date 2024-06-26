import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

class PostService {
  createPost = (aid, post) => {
    return axios.post(`${API_BASE_URL}/post/article/${aid}`, post, {
      withCredentials: true,
    });
  };

  createReply = (pid, post) => {
    return axios.post(`${API_BASE_URL}/reply-to-post/${pid}`, post, {
      withCredentials: true,
    });
  };

  deletePost = (pid) => {
    return axios.delete(`${API_BASE_URL}/post/${pid}`, {
      withCredentials: true,
    });
  };

  deleteAnyPost = (pid) => {
    return axios.delete(`${API_BASE_URL}/post/${pid}/any`, {
      withCredentials: true,
    });
  };

  updatePost = (pid, updatedPost) => {
    return axios.put(`${API_BASE_URL}/post/update/${pid}`, updatedPost, {
      withCredentials: true,
    });
  };

  updateAnyPost = (pid, updatedPost) => {
    return axios.put(`${API_BASE_URL}/post/${pid}/any`, updatedPost, {
      withCredentials: true,
    });
  };

  getArticlePosts = (aid) => {
    return axios.get(`${API_BASE_URL}/posts/article/${aid}`, {
      withCredentials: true,
    });
  };

  getPostById = (pid) => {
    return axios.get(`${API_BASE_URL}/post/${pid}`, {
      withCredentials: true,
    });
  };
}

export default new PostService();
