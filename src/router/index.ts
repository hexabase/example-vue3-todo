import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AddTaskView from "@/views/AddTaskView.vue";

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
  ],
});

export default router;
