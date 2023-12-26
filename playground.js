import { servertap, websocket } from "./index.js";

const s = new servertap("coralcave.xyz", "4567", "change_me")
console.log(await s.server.get())