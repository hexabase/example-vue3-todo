<script setup lang="ts">
import type { CreateNewItemPl } from "@hexabase/hexabase-js/dist/lib/types/item";
import { reactive, ref } from "vue";
import { useHexabaseStore } from "../stores/hexabase";
import type { FormInstance } from "element-plus";
import { useRouter, useRoute } from "vue-router";

const store = useHexabaseStore();
const router = useRouter();
const route = useRoute();
const message = ref("");

const id = route.params.id as string;

const { itemDetails, error } = await store.client.item.getItemDetail(
  store.datastoreId,
  id as string,
  store.projectId,
  {
    use_display_id: true,
    return_number_value: true,
    format: "map",
    include_linked_items: true,
    include_lookups: true,
  }
);
if (error) {
  message.value = "Failed to get item details.";
}
store.replaceItem(id, itemDetails);

const item = store.getItem(id);
const showDate = (date: Date) => {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
</script>

<style></style>
<template>
  <main>
    <el-alert :title="message" type="error" v-if="message !== ''" />
    <router-link to="/">Back</router-link>
    <el-row>
      <el-col :span="24"><strong>Name</strong></el-col>
      <el-col :span="24">{{ item.field_values.name.value }}</el-col>
      <el-col :span="24"><strong>Deadline</strong></el-col>
      <el-col :span="24">{{
        showDate(item.field_values.deadlineDate.value)
      }}</el-col>
      <el-col :span="24"><strong>Description</strong></el-col>
      <el-col :span="24">{{ item.field_values.description.value }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="18"></el-col>
    </el-row>
  </main>
</template>
