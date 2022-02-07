import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

class AccountService {
  updatePassword = (userCurrent) => {
    return axios.put(`${API_BASE_URL}/user/update-password`, userCurrent, {
      withCredentials: true,
    });
  };

  getCurrentUser = () => {
    return axios.get(`${API_BASE_URL}/current-user`, { withCredentials: true });
  };

  getUserByPostId = (id) => {
    return axios.get(`${API_BASE_URL}/user/post/${id}`, {
      withCredentials: true,
    });
  };

  verifyAccount = (confirmationToken) => {
    return axios.get(
      `${API_BASE_URL}/verify-account?token=` + confirmationToken,
      {
        withCredentials: true,
      }
    );
  };

  changeEmail = (confirmationToken) => {
    return axios.get(
      `${API_BASE_URL}/change-username?token=` + confirmationToken,
      {
        withCredentials: true,
      }
    );
  };

  getPostsWithArticles = (uid) => {
    return axios.get(`${API_BASE_URL}/user/posts-with-articles/${uid}`, {
      withCredentials: true,
    });
  };

  getAllArticlesFromUser = (uid) => {
    return axios.get(`${API_BASE_URL}/user/articles/${uid}`, {
      withCredentials: true,
    });
  }

  
}

export default new AccountService();
