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
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty("user");

            expect(response.body.user).toHaveProperty("name");
            expect(response.body.user).toHaveProperty("email");
            expect(response.body.user).toHaveProperty("userId");
        }
    )
    
    it(
        "PATCH /v1/users should respond with 200 Ok on successful update.",
        async() => {
            const response = await server
                .patch("/v1/users")
                .set("Authorization", `Bearer ${authToken}`)
                .send({name: "NewName"});


            expect(response.status).toBe(200);

            expect(response.body["status"]).toBe("success");
        }
    )

    it(
        "PATCH /v1/users should respond with 200 Ok on successful update.",
        async() => {
            const response = await server
                .patch("/v1/users")
                .set("Authorization", `Bearer ${authToken}`)
                .send({name: "NewName"});


            expect(response.status).toBe(200);

            expect(response.body["status"]).toBe("success");
        }
    )
    
    it("should logout successfully with 200 OK", async () => {
        const response = await server
            .get("/v1/users/logout")
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
    });

    it("should block access to protected route after logout", async () => {
        const logoutResponse = await server
            .get("/v1/users/logout")
            .set("Authorization", `Bearer ${authToken}`);

        expect(logoutResponse.body).toHaveProperty("error");
        expect(logoutResponse.body).toHaveProperty("message");

        expect(logoutResponse.body["error"]).toBe("Unauthorized");
        expect(logoutResponse.body["message"]).toBe("User already been logged out.");

        const response = await server
            .get("/v1/users")
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(401);
    });
});