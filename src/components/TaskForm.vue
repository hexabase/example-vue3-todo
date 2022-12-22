<script setup lang="ts">
import type { CreateNewItemPl } from "@hexabase/hexabase-js/dist/lib/types/item";
import { reactive, ref } from "vue";
import { useHexabaseStore } from "../stores/hexabase";
import type { FormInstance } from "element-plus";
import { useRouter } from "vue-router";

const store = useHexabaseStore();
const message = ref("");
const router = useRouter();

// Form instance and inputs
const formRef = ref<FormInstance>();
const taskForm = reactive<{
  name: string;
  description: string;
  deadlineDate: string;
}>({
  name: "",
  description: "",
  deadlineDate: "",
});

// Submit form
const save = (formEl: FormInstance | undefined) => {
  // If there is no form element, return
  if (!formEl) return;
  // Validate form
  formEl.validate(async (valid: boolean) => {
    // If validation fails, return
    if (!valid) return;
    _saveItem();
  });
};

const _saveItem = async () => {
  // Build item parameters
  const item = {
    name: taskForm.name,
    description: taskForm.description,
    deadlineDate: new Date(taskForm.deadlineDate),
  };
  // Build parameters
  const params: CreateNewItemPl = {
    item,
    use_display_id: true,
    return_item_result: true,
  };
  // Save item
  const { itemNew, error } = await store.client.item.create(
    store.projectId,
    store.datastoreId,
    params
  );
  // If save fails, show error message
  if (error) {
    _setMessage("Failed to create item.");
    return;
  } else {
    // If save succeeds, add item to store
    store.addItem(itemNew!);
    router.back();
  }
};

// Show error message
const _setMessage = (str: string) => {
  message.value = str;
  setTimeout(() => {
    message.value = "";
  }, 3000);
};
</script>

<style></style>
<template>
  <main>
    <el-form
      ref="formRef"
      :model="taskForm"
      label-width="120px"
      class="task-form"
    >
      <el-form-item
        prop="name"
        label="Name"
        :rules="[
          {
            required: true,
            message: 'Please input task name',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="taskForm.name" />
      </el-form-item>
      <el-form-item
        prop="description"
        label="Description"
        :rules="[
          {
            required: true,
            message: 'Please input task description',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="taskForm.description" type="textarea" />
      </el-form-item>
      <el-form-item prop="deadlineDate" label="Deadline">
        <el-date-picker
          v-model="taskForm.deadlineDate"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-form-item>
      <el-alert :title="message" type="error" v-if="message" />
      <el-form-item>
        <el-button type="primary" @click="save(formRef)">Save</el-button
        >&nbsp;or&nbsp;
        <router-link to="/">Cancel</router-link>
      </el-form-item>
    </el-form>
  </main>
</template>
