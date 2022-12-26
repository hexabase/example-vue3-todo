import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AddTaskView from "@/views/AddTaskView.vue";
import ShowTaskView from "@/views/ShowTaskView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    // New task form
    {
      path: "/add",
      name: "addTask",
      component: AddTaskView,
    },
    {
      path: "/:id",
      name: "showTask",
      component: ShowTaskView,
    },
    {
      path: "/:id/edit",
      name: "editTask",
      component: AddTaskView,
    },
  ],
});

export default router;
