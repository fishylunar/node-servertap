# node-servertap
 NodeJS Library for the Minecraft server plugin ServerTap

 Endpoints implemented: 
- advancements: `v1/advancements`
- chat
  - broadcast: `v1/chat/broadcast`
  - tell: `v1/chat/tell`
- economy
  - info: `v1/economy`
  - debit: `v1/economy/debit`
  - pay: `v1/economy/pay`
- placeholderapi: `v1/placeholders/replace`
- player
  - get
    - allOnline: `v1/players`
    - all: `v1/players/all`
    - uuid: `v1/players/`
    - inventory: `v1/players/`
  - ops: `v1/server/ops`
- plugins: `v1/plugins`
- server
  - ping: `v1/ping`
  - scoreboard: `v1/scoreboard`
  - exec: `v1/server/exec`
  - info: `v1/server`
  - whitelist: `v1/server/whitelist`
- worlds
  - all: `v1/worlds`
  - worlds: `v1/worlds/`
  - download: `v1/worlds/download`
  - save: `v1/worlds/save`