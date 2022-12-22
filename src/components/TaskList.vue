<script setup lang="ts">
import { ref } from "vue";
import { useHexabaseStore } from "../stores/hexabase";
const store = useHexabaseStore();
const message = ref(""); // For error message
// Get items from Hexabase datastore
const { dsItems, error } = await store.client.item.get(
  {
    page: 1,
    per_page: 10,
  },
  store.datastoreId,
  store.projectId
);
// If there is an error, set the message
if (error) {
  message.value = JSON.parse(error)
    .map((e: any) => e.message)
    .join("\n");
} else {
  // If there is no error, set items to store
  store.setItems(dsItems?.items);
}

// Move detail page
const detail = (item: any) => {
  console.log(item.i_id);
};
// Move edit page
const edit = (item: any) => {
  console.log(item.i_id);
};
</script>

<style>
.actions {
  margin-bottom: 20px;
}
</style>
<template>
  <main>
    <!-- Show message -->
    <el-alert :title="message" type="error" v-if="message !== ''" />
    <!-- Move to new task form -->
    <el-row class="actions">
      <router-link to="/add">Add task</router-link>
    </el-row>
    <!-- Show list of datastore items -->
    <el-table :data="store.items" v-if="store.items.length > 0">
      <el-table-column
        prop="i_id"
        label="ID"
        width="90"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="title" label="Title" width="180" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="detail(scope)"
            >Detail</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="edit(scope.row)"
            >Edit</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>
