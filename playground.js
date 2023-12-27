// Import the package - npm i node-servertap
import { servertap, websocket } from "node-servertap";

// Create our instance
const instance = new servertap(
    "localhost", // Server IP / domain
    "4567", // ServerTap port, Default is 4567
    "change_me" // ServerTap key, Default is "change_me"
    )

// Using await
console.log(await instance.server.ping()) // Returns "pong"

// Promises
instance.server.whitelist.get().then(result => {
    console.log(result) // Returns the server whitelist as an Array of Objects
})

// How to use the websocket:
// Import "wehsocket" from node-servertap, then create a new ws like this:
const ws = new websocket(
    instance // Our servertap instance from before
    ).init(
        false // Wether or not to use TLS
        )

// Then use it as you normally would, for example
ws.on("open", (stream) => {
    console.log("Connected!")

    // send commands
    ws.send("say hi from node")
})