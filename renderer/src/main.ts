// Same global CSS order as back/src/main.ts, so frames look exactly like the backoffice.
import "@/styles/layersOrder.css"
import "remixicon/fonts/remixicon.css"
import "digicomponents/dist/style.css"
import "@/styles/bootstrapUtils.scss"
import "./studio.css"

import { createApp } from "vue"

import App from "./App.vue"
import { i18nStub } from "./i18n"
import { router } from "./router"

// Memory history starts on no route; backoffice menu items throw when route.name is undefined.
void router.push("/")
await router.isReady()
createApp(App).use(i18nStub).use(router).mount("#app")
