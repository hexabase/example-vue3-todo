/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_USER_EMAIL: string;
  readonly VITE_USER_PASSWORD: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
