import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

class ArticleService {
  createArticle = (article) => {
    return axios.post(`${API_BASE_URL}/article`, article, {
      withCredentials: true,
    });
  };

  getArticleById = (aid) => {
    return axios.get(`${API_BASE_URL}/article/${aid}`, {
      withCredentials: true,
    });
  };

  getArticleCreator = (aid) => {
    return axios.get(`${API_BASE_URL}/article/${aid}/creator`, {
      withCredentials: true,
    });
  };

  getArticles = () => {
    return axios.get(`${API_BASE_URL}/articles`, {
      withCredentials: true,
    });
  };

  getMostCommentedArticles = () => {
    return axios.get(`${API_BASE_URL}/articles/most-commented`, {
      withCredentials: true,
    });
  };

  getNewestArticles = () => {
    return axios.get(`${API_BASE_URL}/articles/newest`, {
      withCredentials: true,
    });
  };

  updateArticle = (aid, updatedArticle) => {
    return axios.put(`${API_BASE_URL}/article/${aid}`, updatedArticle, {
      withCredentials: true,
    });
  };

  deleteArticle = (aid) => {
    return axios.delete(`${API_BASE_URL}/article/${aid}`, {
      withCredentials: true,
    });
  };
}

export default new ArticleService();
