import { makeReadonly } from "../libs/utils";

export const config = makeReadonly({
    PORT: Number(process.env.PORT) || 3000,
    MONGO_URI: process.env.MONGO_URI,
    get JWT_SEC() {
        const secret = process.env.JWT_SEC;
        if(!secret) {
            throw new Error("JWT secret key is not found.");
        }
        return secret;
    },
    SALT_ROUNDS: 10,
});

export const BACKEND = makeReadonly({
    PROTOCOL: "http",
    PORT: Number(process.env.PORT) || 3000,
    get DOMAIN() {
        return `localhost:${this.PORT}`
    },
    get URL() {
        return `${this.PROTOCOL}://${this.DOMAIN}`
    },
});