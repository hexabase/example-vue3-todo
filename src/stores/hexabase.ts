import { ref } from "vue";
import { defineStore } from "pinia";
import { HexabaseClient } from "@hexabase/hexabase-js";
import type { UserInfo } from "@hexabase/hexabase-js/dist/lib/types/user";
const HB_URL = import.meta.env.VITE_API_ENDPOINT;
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
const DATASTORE_ID = import.meta.env.VITE_DATASTORE_ID;

export const useHexabaseStore = defineStore("hexabase", () => {
  // Get token from local storage, or empty string if not found
  const value = localStorage.getItem(STORAGE_KEY) || "";
  // Initialize Hexabase client
  const client = new HexabaseClient(HB_URL, value);
  // Login status detection (true if token is not empty)
  const login = ref(client.tokenHxb !== "");
  // Set user info, if there is a token
  const currentUser = ref<UserInfo | null>(null);

  // Hexabase project and datastore IDs
  const projectId = PROJECT_ID;
  const datastoreId = DATASTORE_ID;

  // Datastore items
  const items = ref<any[]>([]);

  if (value !== "") {
    client.user.get(value).then((res) => {
      currentUser.value = res.userInfo!;
    });
  }

  // Set token function
  const setToken = async (token: string) => {
    // Set token to client
    client.setToken(token!);
    currentUser.value = (await client.user.get(token!)).userInfo!;
    // Set login status to true
    login.value = true;
    // Save token to local storage
    localStorage.setItem(STORAGE_KEY, token);
  };

  // Remove token function
  const removeToken = () => {
    // Remove token from local storage
    localStorage.removeItem(STORAGE_KEY);
    // Set login status to false
    login.value = false;
  };

  // Add items to store
  const setItems = (ary: any[]) => {
    items.value = ary;
  };

  // Add an item to store
  const addItem = (item: any) => {
    items.value.push(item);
  };

  // Return an item by id
  const getItem = (id: string) => {
    return items.value.find((item) => item.i_id === id);
  };

  // Expose client, login, and setToken
  return {
    client,
    login,
    setToken,
    removeToken,
    currentUser,
    setItems,
    addItem,
    getItem,
    items,
    projectId,
    datastoreId,
  };
});
