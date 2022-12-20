<script setup lang="ts">
import { reactive, ref } from "vue";
import { useHexabaseStore } from "../stores/hexabase";
import type { FormInstance } from "element-plus";
const store = useHexabaseStore();

const formRef = ref<FormInstance>();
const authForm = reactive<{
  email: string;
  password: string;
}>({
  email: import.meta.env.VITE_USER_EMAIL,
  password: import.meta.env.VITE_USER_PASSWORD,
});

// For error message
const message = ref("");

// Submit form
const submit = (formEl: FormInstance | undefined) => {
  // If there is no form element, return
  if (!formEl) return;
  // Validate form
  formEl.validate(async (valid) => {
    // If validation fails, return
    if (!valid) return;
    // If validation succeeds, call login function
    await _login(authForm.email, authForm.password);
  });
};

// Reset form
const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// Login function
const _login = async (email: string, password: string) => {
  // Login to Hexabase
  const { token, error } = await store.client.auth.login({
    email,
    password,
  });
  // If login fails, show error message
  if (error) {
    _setMessage("Login failed.");
    return;
  }
  // If login succeeds, set token to store
  store.setToken(token!);
};

// Show error message
const _setMessage = (str: string) => {
  message.value = str;
  setTimeout(() => {
    message.value = "";
  }, 3000);
};
</script>

<template>
  <main>
    <el-form
      ref="formRef"
      :model="authForm"
      label-width="120px"
      class="login-form"
    >
      <el-form-item
        prop="email"
        label="Email"
        :rules="[
          {
            required: true,
            message: 'Please input email address',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input v-model="authForm.email" />
      </el-form-item>
      <el-form-item
        prop="password"
        label="Password"
        :rules="[
          {
            required: true,
            message: 'Please input password',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="authForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-alert :title="message" type="error" v-if="message" />
      <el-form-item>
        <el-button type="primary" @click="submit(formRef)">Login</el-button>
        <el-button @click="reset(formRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </main>
</template>
