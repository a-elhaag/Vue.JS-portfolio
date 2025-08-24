/// <reference types="vite/client" />

// Declare module for raw imports
declare module "*?raw" {
  const content: string;
  export default content;
}

// Declare Vue files
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
