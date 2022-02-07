import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

class AuthenticationService {
  signUp = (signUpRequest) => {
    return axios.post(`${API_BASE_URL}/sign-up`, signUpRequest);
  };

  signIn = (username, password) => {
    return axios
      .post(`${API_BASE_URL}/sign-in`, {username, password}, {
        withCredentials: true,
      })
      .then((response) => {
        return response.data;
      });
  };

  signOut = () => {
    console.log("sign-out");
    return axios.get(`${API_BASE_URL}/sign-out`, {withCredentials: true});

  }

}

export default new AuthenticationService();
