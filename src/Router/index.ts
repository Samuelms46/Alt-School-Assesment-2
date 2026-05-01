import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import HomePage from "../Pages/Homepage.vue";
import TodoDetailPage from "../Pages/TodoDetailsPage.vue";
import NotFoundPage from "../Pages/NotFoundPage.vue";
import ErrorTestPage from "../Pages/ErrorTestPage.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },
  {
    path: "/todo/:id",
    name: "todo-detail",
    component: TodoDetailPage,
    props: (route: RouteLocationNormalized) => ({
      id: String(route.params.id),
    }),
  },
  { path: "/error-test", name: "error-test", component: ErrorTestPage },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
