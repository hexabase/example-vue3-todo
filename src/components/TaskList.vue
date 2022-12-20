<script setup lang="ts">
import { useHexabaseStore } from "../stores/hexabase";
const store = useHexabaseStore();
</script>

<template>
  <main>
    <h1>Hello, {{ store.currentUser!.username }}</h1>
  </main>
</template>
