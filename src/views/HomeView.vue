<script setup lang="ts">
import TaskList from "../components/TaskList.vue";
import Login from "../components/LoginForm.vue";
import { useHexabaseStore } from "../stores/hexabase";
const store = useHexabaseStore();
</script>

<template>
  <main>
    <div v-if="store.login">
      <TaskList />
    </div>
    <div v-else>
      <Login />
    </div>
  </main>
</template>
