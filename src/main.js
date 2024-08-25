
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { StyleProvider, Themes } from "@varlet/ui";

import './style/main.css'

const app = createApp(App);

StyleProvider(Themes.md3Light)

app.use(router);
app.mount("#app");