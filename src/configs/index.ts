import { makeReadonly } from "../libs/utils";

function assertInvalid(value: any, error: string): asserts value {
    if (!value) {
        throw new Error(error);
    }
}

export const config = makeReadonly({
    PORT: Number(process.env.PORT) || 3000,
    get MONGO_URI() {
        const uri = process.env.MONGO_URI;
        
        assertInvalid(
            uri,
            "MongoDB connection uri is not found."
        );

        return uri;    
    },
    get JWT_SEC() {
        const secret = process.env.JWT_SEC;
        
        assertInvalid(
            secret,
            "JWT secret key is not found."
        );

        return secret;
    },
    SALT_ROUNDS: 10,
    ID_LENGTH: 10,
    get REDIS_URI() {
        const uri = process.env.REDIS_URI;
        assertInvalid(
            uri,
            "REDIS URI not found."
        );
        return uri;
    }
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