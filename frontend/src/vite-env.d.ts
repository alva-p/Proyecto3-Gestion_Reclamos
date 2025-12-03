/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CLIENTE_ID?: string
  readonly VITE_DEMO_CLIENT_EMAIL?: string
  readonly VITE_DEMO_CLIENT_PASSWORD?: string
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
