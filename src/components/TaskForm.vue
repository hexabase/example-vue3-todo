<script setup lang="ts">
import type {
  CreateNewItemPl,
  ItemActionParameters,
} from "@hexabase/hexabase-js/dist/lib/types/item";
import { reactive, ref } from "vue";
import { useHexabaseStore } from "../stores/hexabase";
import type { FormInstance } from "element-plus";
import { useRouter, useRoute } from "vue-router";

const store = useHexabaseStore();
const message = ref("");
const router = useRouter();
const route = useRoute();

const id = route.params.id as string | undefined;
if (id) {
  const { itemDetails, error } = await store.client.item.getItemDetail(
    store.datastoreId,
    id,
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
}

const _getDefaultValue = (id?: string) => {
  const defaultParams = {
    name: "",
    description: "",
    deadlineDate: "",
  };

  if (!id) return defaultParams;

  const item = store.getItem(id);
  if (!item) return defaultParams;
  return {
    name: item.field_values.name.value,
    description: item.field_values.description.value,
    deadlineDate: item.field_values.deadlineDate.value,
  };
};
// Form instance and inputs
const formRef = ref<FormInstance>();
const taskForm = reactive<{
  name: string;
  description: string;
  deadlineDate: string;
}>(_getDefaultValue(id));

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
  const { item, error } = await (id ? _updateItem() : _createItem());
  // If save fails, show error message
  if (error) {
    _setMessage("Failed to create item.");
    return;
  } else {
    // If save succeeds, add item to store
    store.addItem(item!);
    router.back();
  }
};

const _createItem = async (): Promise<{
  item: any;
  error: string | undefined;
}> => {
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
  return { item: itemNew, error };
};

const _updateItem = async (): Promise<{
  item: any;
  error: string | undefined;
}> => {
  const task = store.getItem(route.params.id as string);
  // Build item parameters
  const item = {
    name: taskForm.name,
    description: taskForm.description,
    deadlineDate: new Date(taskForm.deadlineDate),
  };
  // Build parameters
  const params: ItemActionParameters = {
    item,
    rev_no: task.rev_no,
    use_display_id: true,
    return_item_result: true,
  };
  const res = await store.client.item.update(
    store.projectId,
    store.datastoreId,
    id!,
    params
  );
  return { item: task, error: res.error };
};

// Show error message
const _setMessage = (str: string) => {
  message.value = str;
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

// Delete item
const remove = async () => {
  if (!confirm("Are you sure you want to delete this item?")) return;
  // Get parameters
  const task = store.getItem(id!);
  const a_id = task.item_actions.DeleteItem.a_id;
  // Delete request
  const { error } = await store.client.item.delete(
    store.projectId,
    store.datastoreId,
    id!,
    {
      a_id,
    }
  );
  // Handling response
  if (error) {
    _setMessage("Failed to delete item.");
  } else {
    store.removeItem(id!);
    router.back();
  }
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
      <div v-if="id">
        <el-form-item>
          <el-button type="warning" @click="remove">Delete</el-button>
        </el-form-item>
      </div>
    </el-form>
  </main>
</template>
