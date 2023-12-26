import { servertap, endpoints } from "./index.js";

const s = new servertap("coralcave.xyz", "4567", "change_me")
console.log(await s.player.get.allOnline())