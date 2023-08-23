import api from "./api";
import TokenService from "./token.service";

class AuthService {
  login({ email, password }) {
    return api
      .post("/auth/signin", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          // localStorage.setItem('user', JSON.stringify(response.data));
          TokenService.setUser(response.data);
        }

        return response.data;
      });
  }

  logout() {
    // localStorage.removeItem('user');
    TokenService.removeUser();
  }

  register({ username, email, password }) {
    return api.post("/auth/signup", {
      username,
      email,
      password,
    });
  }

  borrow_book({ book_id, user, date_borrow, due_date }) {
    return api.post("/test/book/borrow", {
      book_id,
      user,
      due_date,
      date_borrow,
    });
  }

  borrow_update({ borrow_id, status }) {
    return api.post("/test/borrow/update", {
      borrow_id,
      status,
    });
  }
}

export default new AuthService();
