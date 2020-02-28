/*
 * Define the application routes:
 * - main routes
 * - login and register pages
 *
 * Check if user authentication is required for a route
 */

import Vue from "vue";
import Router from "vue-router";

// Import the routes pages
import HomePage from "../views/HomePage";
import LoginPage from "../views/LoginPage";
// import RegisterPage from "../views/RegisterPage";
// import LostPasswordPage from "../views/LostPasswordPage";

// Import data from the store
import { store } from "../_store";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    { path: "/", component: HomePage },
    { path: "/login", component: LoginPage },
    // { path: "/register", component: RegisterPage },
    // { path: "/lost_password", component: LostPasswordPage },

    // otherwise redirect to home
    { path: "*", redirect: "/" }
  ]
});

/*
 * Before each navigation, check if the user is logged in
 */
router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  // console.warn("beforeEach", to, from, next);

  const publicPages = ["/login", "/register", "/me", "/lost_password"];
  const authRequired = !publicPages.includes(to.path);
  const isLoggedIn = store.getters["user/isLoggedIn"];

  if (authRequired && !isLoggedIn) {
    return next("/login");
  }

  next();
});
