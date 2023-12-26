import fetch from 'node-fetch';
import WebSocket from 'ws';
/**
 * API Endpoints for ServerTap
 */
const endpoints = {
    advancements: "v1/advancements",
    chat: {
        broadcast: "v1/chat/broadcast",
        tell: "v1/chat/tell"
    },
    economy: {
        info: "v1/economy",
        debit: "v1/economy/debit",
        pay: "v1/economy/pay"
    },
    placeholderapi: "v1/placeholders/replace",
    player: {
        get: {
            allOnline: "v1/players",
            all: "v1/players/all",
            uuid: "v1/players/",
            inventory: "v1/players/"
        },
        ops: "v1/server/ops"
    },
    plugins: "v1/plugins",
    server: {
        ping: "v1/ping",
        scoreboard: "v1/scoreboard",
        exec: "v1/server/exec",
        info: "v1/server",
        whitelist: "v1/server/whitelist"
    },
    worlds: {
        all: "v1/worlds",
        worlds: "v1/worlds/",
        download: "v1/worlds/download",
        save: "v1/worlds/save"
    }
}

/**
 * main
 */
class servertap {
    /**
     * ServerTap instance
     * @param {String} baseURL IP or URL to the ServerTap enabled server
     * @param {String} port The ServerTap Web API port
     * @param {String} apiKey Your password / API Key
     */
    constructor(baseURL, port, apiKey) {
        this.baseURL = baseURL;
        this.port = port;
        this.apiKey = apiKey;

        this.advencements = new __AdvencementsClass(this)
        this.server = new __serverClass(this)
        this.chat = new __chatClass(this)
        this.economy = new __economyClass(this)

        this.placeholderAPI = function placeholderAPI(message, uuid) {
            return webRequest(this, "/v1/placeholders/replace", "POST", `message=${message}&uuid=${uuid}`)
        }

        this.player = new __playerClass(this)
        this.plugins = new __pluginClass(this)
    }

}

/**
 * Websocket class
 */
class websocket {
    /**
     * @param {servertap} servertapInstance Instanceof the servertap client.
     */
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance
    }

    /**
     * Init the websocket
     * @param {Boolean} tls Weather or not to use TLS
     * @returns {WebSocket} WebSocket object
     */
    init(tls = false) {
        return new WebSocket(`${tls ? "wss" : "ws"}://${this.servertapInstance.baseURL}:${this.servertapInstance.port}/v1/ws/console`, {
            headers: {
                Cookie: "x-servertap-key=" + this.servertapInstance.apiKey
            }
        });
    }
}

/**
 * Advancements
 */
class __AdvencementsClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance
    }

    /**
     * Advancements
     * @returns {JSON} Gets all server advancements.
     */
    get() {
        return webRequest(this.servertapInstance, endpoints.advancements, "GET")
    }
}
/**
 * Class containing Chat functions
 */
class __chatClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance
    }

    /**
     * Send broadcast visible to those currently onliene.
     * @param {String} message Message to be broadcast
     */
    broadcast(message) {
        return webRequest(this.servertapInstance, endpoints.chat.broadcast, "POST", `message=${message}`)
    }

    /**
     * Send a message to a specefic player
     * @param {String} player player UUID
     * @param {String} message Message to be sent
     */
    tell(player, message) {
        return webRequest(this.servertapInstance, endpoints.chat.tell, "POST", `message=${message}&playerUuid=${player}`)
    }
}
class __economyClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance
    }

    /**
     * Economy
     * @returns {JSON} Economy plugin information
     */
    info() {
        return webRequest(servertapInstance, endpoints.economy.info, "GET")
    }

    /**
     * Debit a player
     * @param {String} uuid Player UUID
     * @param {Number} amount Amount
     * @returns {JSON} Response
     */
    debit(uuid, amount) {
        return webRequest(this.servertapInstance, endpoints.economy.debit, "POST", `uuid=${uuid}&amount=${amount}`)
    }

    /**
     * Pay a player
     * @param {String} uuid Player UUID
     * @param {Number} amount Amount
     * @returns {JSON} Response
     */
    pay(uuid, amount) {
        return webRequest(this.servertapInstance, endpoints.economy.pay, "POST", `uuid=${uuid}&amount=${amount}`)
    }
}


/**
 * Main class for interacting with players
 */
class __playerClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance
        this.get = new __player_getClass(this)
        this.op = new __player_opClass(this)
    }
}

/**
 * Class containing methods for retrieving various player data
 */
class __player_getClass {
    constructor(servertapInstance) {
            this.servertapInstance = servertapInstance.servertapInstance
        }
        /**
         * Get all online players
         * @returns {JSON} Object containing all currently online players
         */
    allOnline() {
            return webRequest(this.servertapInstance, endpoints.player.get.allOnline, "GET")
        }
        /**
         * Get ALL players
         * @returns {JSON} Object containing ALL players
         */
    all() {
            return webRequest(this.servertapInstance, endpoints.player.get.all, "GET")
        }
        /**
         * Get online player by their UUID
         * @param {String} playerUUID Minecraft player uuid
         * @returns {JSON} Player Object
         */
    uuid(playerUUID) {
            return webRequest(this.servertapInstance, endpoints.player.get.uuid + playerUUID, "GET")
        }
        /**
         * Get inventory from online player by their UUID and their world UUID
         * @param {String} playerUUID Minecraft player uuid
         * @param {String} worldUUID Minecraft world uuid
         * @returns {JSON} World Object
         */
    inventory(playerUUID, worldUUID) {
        return webRequest(this.servertapInstance, endpoints.player.get.inventory + playerUUID + "/" + worldUUID, "GET")
    }
}

/**
 * Class containing methods for managing OPs / Admins
 */
class __player_opClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance.servertapInstance // Im not sure why we need to do it like this.
            // My theory is its because of the nested nested classes xd
    }

    /**
     * Get all OPs / Admins
     * @returns {JSON} Object with OPs / Admins
     */
    get() {
        return webRequest(this.servertapInstance, endpoints.player.ops, "GET")
    }

    /**
     * OP someone
     * @param {String} player Target player UUID
     * @returns {JSON} Returns any errors
     */
    add(player) {
        return webRequest(this.servertapInstance, endpoints.player.ops, "POST", `playerUuid=${player}`)
    }

    /**
     * De-OP someone
     * @param {String} player Target player UUID
     * @returns {JSON} Returns any errors
     */
    remove(player) {
        return webRequest(this.servertapInstance, endpoints.player.ops, "DELETE", `playerUuid=${player}`)
    }
}

class __pluginClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance;
    }

    /**
     * Get all plugins
     * @returns {JSON} Object containing plugins
     */
    get() {
        return webRequest(this.servertapInstance, endpoints.plugins, "GET")
    }

    /**
     * Install a plugin
     * @param {String} url URL to the plugin JAR file
     * @returns {JSON} Returns any errors
     */
    add(url) {
        return webRequest(this.servertapInstance, endpoints.plugins, "POST", `downloadUrl=${encodeURI(url)}`)
    }
}

class __serverClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance
        this.whitelist = new __serverWhitelistClass(this)
        this.worlds = new __serverWorldsClass(this)
    }

    /**
     * Get information about the server
     * @returns {JSON} Server Info
     */
    get() {
        return webRequest(this.servertapInstance, endpoints.server.info, "GET")
    }

    /**
     * Execute a command on the server
     * @param {String} command 
     * @param {Number} time 
     * @returns Response
     */
    executeCommand(command, time) {
        return webRequest(this.servertapInstance, endpoints.server.exec, "POST", `command=${command}&time=${time}`)
    }

    /**
     * Ping
     * @returns {JSON} Ping
     */
    ping() {
        return webRequest(this.servertapInstance, endpoints.server.ping, "GET")
    }

}

class __serverWhitelistClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance.servertapInstance
    }
    get() {
        return webRequest(this.servertapInstance, endpoints.server.whitelist, "GET")
    }
    add(uuid, name) {
        return webRequest(this.servertapInstance, endpoints.server.whitelist, "POST", `uuid=${uuid}&name=${name}`)
    }
    remove(uuid, name) {
        return webRequest(this.servertapInstance, endpoints.server.whitelist, "DELETE", `uuid=${uuid}&name=${name}`)
    }

}

class __serverWorldsClass {
    constructor(servertapInstance) {
        this.servertapInstance = servertapInstance.servertapInstance
    }
    getAll() {
        return webRequest(this.servertapInstance, endpoints.worlds.all, "GET")
    }
    get(uuid) {
        return webRequest(this.servertapInstance, endpoints.worlds.worlds + uuid, "GET")
    }
    download(uuid) {
        return webRequest(this.servertapInstance, endpoints.worlds.worlds + uuid + "/download", "GET")
    }
    downloadAll() {
        return webRequest(this.servertapInstance, endpoints.worlds.download, "GET")
    }
    save(uuid) {
        return webRequest(this.servertapInstance, endpoints.worlds.all + uuid + "/save", "POST")
    }
    saveAll() {
        return webRequest(this.servertapInstance, endpoints.worlds.save, "POST")
    }
}
/**
 * QoL function to handle web requests
 * @param {servertap} instance Instance of servertap (this.servertapInstance)
 * @param {String} endpoint API Endpoint
 * @param {String} method HTTP Method (IN CAPS) (GET, POST, DELETE)
 * @param {String} body Request body if there is need for one
 * @returns {Promise} Promise of JSON object response from the server
 */
function webRequest(instance, endpoint, method, body = undefined) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "key": `${instance.apiKey}`,
            }
        };

        if (body) requestOptions.body = new URLSearchParams(body).toString();

        fetch(`http://${instance.baseURL}:${instance.port}/${endpoint}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

export { servertap, endpoints, websocket }