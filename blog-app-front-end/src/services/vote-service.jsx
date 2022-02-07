import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

class VoteService {
  upvotePost = (pid) => {
    return axios.get(`${API_BASE_URL}/upvote/${pid}`, {
      withCredentials: true,
    });
  };

  downvotePost = (pid) => {
    return axios.get(`${API_BASE_URL}/downvote/${pid}`, {
      withCredentials: true,
    });
  };


 
}

export default new VoteService();
