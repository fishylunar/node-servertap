import { servertap } from "./index.js"

describe('servertap', () => {
    test('init', () => {
        expect(new servertap("owo", "uwu", "nya"))
            .toMatchObject({ "apiKey": "nya", "baseURL": "owo", "port": "uwu" })
    })
})