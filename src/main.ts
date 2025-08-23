import { createApp } from "vue";
import App from "./App.vue";
import { welcome } from "./data/welcome";
import "./styles/base.css";

const app = createApp(App);

// set the document title from welcome.ts
document.title = welcome.name;

app.mount("#app");
