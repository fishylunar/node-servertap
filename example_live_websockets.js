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