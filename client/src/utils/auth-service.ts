import { jwtDecode } from "jwt-decode";

interface UserToken {
  name: string;
  exp: number;
}

class AuthService {
  getProfile() {
    return jwtDecode(this.getToken() || "");
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
  }

  logout() {
    localStorage.removeItem("id_token");
  }
}

export default new AuthService();