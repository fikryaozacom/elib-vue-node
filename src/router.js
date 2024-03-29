import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Book from "./components/Book.vue";
import BorrowBook from "./components/BorrowBook.vue";
import BorrowUpdate from "./components/BorrowUpdate.vue";
import History from "./components/History.vue";

// lazy-loaded
const Profile = () => import("./components/Profile.vue");
const BoardAdmin = () => import("./components/BoardAdmin.vue");
const BoardModerator = () => import("./components/BoardModerator.vue");
const BoardUser = () => import("./components/BoardUser.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: BoardAdmin,
  },
  {
    path: "/mod",
    name: "moderator",
    // lazy-loaded
    component: BoardModerator,
  },
  {
    path: "/user",
    name: "user",
    // lazy-loaded
    component: BoardUser,
  },
  {
    path: "/books/:id",
    component: Book,
  },
  {
    path: "/borrow/:id",
    component: BorrowBook,
  },
  {
    path: "/borrow/update/:id",
    component: BorrowUpdate,
  },
  {
    path: "/borrow/update/:id",
    component: BorrowUpdate,
  },
  {
    path: "/history",
    component: History,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/home"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  // trying to access a restricted page + not logged in
  // redirect to login page

  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
