# node-servertap
 NodeJS Library for the Minecraft server plugin ServerTap (https://servertap.io)

 ## Ussage example:
 ```js
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
 ```

 ## Example project:
 ```js
 // Simple example showing how to use node-servertap to get a pretty live server log
// Can be modified to do specefic things depending on what type of event was sent by the server,
// in this example it just changes how it gets logged to the console.

import { servertap, websocket } from 'node-servertap'
import { strip } from 'ansicolor' // For removing color from our data

// Create a client and give it your credentials
const client = new servertap("localhost", 4567, "change_me")

// Array containing objects with player data of all online players
/** @type {String[]} */
const players = await client.player.get.allOnline()

// Create the WebSocket
const wsClass = new websocket(client) // Contains the init() class, and all the parse functions
const ws = wsClass.init(false) // The actual websocket
ws.on("open", function() {
    // keep alive
    setInterval(() => { ws.ping("") }, 10000);
    // Handles when we get data from the websocket
    ws.on("message", function message(rawData) {
        // Format the data
        /** @type {{message:string,timestampMillis:number,loggerName:string,level:string}} */
        var data = JSON.parse(strip(rawData.toString()))
        data.message = strip(data.message)

        // Handle the message we got from the websocket
        handle(data)
    })
})

/**
 * Function that parses and handles events
 * @param {{message:string,timestampMillis:number,loggerName:string,level:string}} data 
 */
function handle(data) {
    let chat = wsClass.parseChat(data, " » ")
    let command = wsClass.parseCommand(data)
    let connectionEvent = wsClass.parseConnections(data)
    let deathEvent = wsClass.parseDeath(data, players)

    // Chats
    if (chat) {
        return console.log("✉️ ", chat.author, ": ", chat.content)
    }
    // Join / Leave
    if (connectionEvent) {
        switch (connectionEvent.type) {
            case "JOIN":
                return console.log("👋", connectionEvent.player, "joined!")
            case "LEAVE":
                return console.log("👋", connectionEvent.player, "left..")
            default:
                break;
        }
    }
    // Player command ussage
    if (command) {
        return console.log("🖥️", command.player, "used command", command.command)
    }
    // Player deaths
    if (deathEvent) {
        return console.log("💀", deathEvent.displayName, "died", deathEvent.message)
    }
    // If not handled by methods above,
    // Log0 = icon, log1 = message
    let log = wsClass.parseLog(data)
    console.log(log[0], log[1])
}
 ```