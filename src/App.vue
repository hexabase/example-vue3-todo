<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useHexabaseStore } from "./stores/hexabase";
const store = useHexabaseStore();
const logout = () => {
  try {
    store.client.auth.logout("");
  } catch (e) {
    // ignore error
  }
  // Remove token from local storage
  store.removeToken();
};
</script>

<template>
  <main>
    <el-container class="hexabase-todo">
      <el-header>
        <div class="title">Todo App</div>
        <div class="toolbar" v-if="store.login">
          <el-button @click="logout" type="primary"
            >({{ store.currentUser?.username }}) Logout</el-button
          >
        </div>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </main>
</template>

<style scoped>
.el-header .title {
  display: inline-flex;
  width: 70%;
}
.el-header .toolbar {
  display: inline-flex;
  width: 30%;
}
</style>
