import { app } from "../src/app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";


const server = supertest(app);

let authToken;
describe("User Signup and Login", () => {

    it(
        "POST /v1/users/signup should respond with 201 created or 409 conflict with valid registration data",
        async() => {
            const user = {
                "name": "Sudhanshu",
                "email": "mail2@mail.co",
                "password": "Passwd@1234"
            }

            const response = await server.post("/v1/users/signup").send(user);
            
            expect([201, 409]).toContain(response.status);
        }
    );


    it(
        "POST /v1/users/login should respond with status 200 and have token property in response json body", 
        async() => {
            const loginCreds = {
                "email": "mail2@mail.co",
                "password": "Passwd@1234"
            }

            const response = await server.post("/v1/users/login").send(loginCreds);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");

            authToken = response.body["token"];
        }
    );
});

describe("User Management", () => {
    it(
        "GET /v1/users should respond with 200 Ok and user info in response body.",
        async() => {
            const response = await server
                .get("/v1/users")
                .set("Authorization", `Bearer ${authToken}`);;

            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty("user");

            expect(response.body.user).toHaveProperty("name");
            expect(response.body.user).toHaveProperty("email");
            expect(response.body.user).toHaveProperty("userId");
        }
    )
});