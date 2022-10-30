import { createRouter, createWebHistory } from "vue-router";
import TableView from "../views/TableView.vue";
import EditTableView from "../views/EditTableView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "tables",
      component: TableView,
    },
    {
      path: "/new",
      name: "new",
      // route level code-splitting
      component: () => import("../views/NewTableView.vue"),
    },
    {
      path: "/:id",
      name: "edit",
      component: EditTableView,
      props: true,
    },
  ],
});

export default router;
