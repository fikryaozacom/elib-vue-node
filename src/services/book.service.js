import api from "./api";
// import authHeader from "./auth-header";

// const API_URL = 'http://localhost:8080/api/test/';

class BookService {
  getPublicContent() {
    return api.get("/test/all");
  }

  getListBook() {
    return api.get("/test/book");
  }

  getBookById(id) {
    return api.get(`/test/book/${id}`);
  }

  getModeratorBoard() {
    return api.get("/test/mod");
  }

  getAdminBoard() {
    return api.get("/test/admin");
  }
}

export default new BookService();
