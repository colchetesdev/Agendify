import { createApp } from "vue"
import Home from "./layout/Layout.vue"
import router from "./router"

const app = createApp(Home)

app.use(router)

app.mount("#app")
