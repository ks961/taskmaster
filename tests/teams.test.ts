import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app";

const server = supertest(app);

let authToken;
describe("Teams Route", () => {
    beforeAll(async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passwd@1234"
        }

        const response = await server.post("/v1/users/login").send(loginCreds);

        authToken = response.body["token"];
    });

    it("Should create new team and respond with 201.", async() => {
        const team = {
            "name": "KopiTest"
        }

        const response = await server
            .post("/v1/teams")
            .set("Authorization", `Bearer ${authToken}`)
            .send(team);

        expect(response.status).toBe(201);
    });

    it("Should fetch team member by 'teamId' and respond with 200.", async() => {
        const teamId = "QAh847VAJF";
        const response = await server
            .get(`/v1/teams/${teamId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("members");
        expect(response.body["members"]).toBeInstanceOf(Array);
        expect(response.body["members"].length).toBeGreaterThan(0);
    });

    it("Should invite new team member by userId or Ids and respond with 200.", async() => {
        const teamId = "QAh847VAJF";
        const payload = {
            "members": ["1IKrY2YCEa"]
        }
        const response = await server
            .post(`/v1/teams/${teamId}/invite`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(payload);

        expect(response.status).toBe(200);
    });
    
    it("Should join new team member by teamId and respond with 200.", async() => {
        const teamId = "QAh847VAJF";
        const response = await server
            .post(`/v1/teams/${teamId}/join`)
            .set("Authorization", `Bearer ${authToken}`);

        
        expect([200, 409].includes(response.status)).toBe(true);
    });
});