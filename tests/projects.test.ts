import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app";

const server = supertest(app);

let authToken;
describe("Project Routes", () => {
    beforeAll(async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passwd@1234"
        }

        const response = await server.post("/v1/users/login").send(loginCreds);

        authToken = response.body["token"];
    });
    
    it("should create new project under a team and respond with 201 ok", async() => {
        const teamId = "QAh847VAJF";
        const payload = {
            name: "Project-name"
        }
        const response = await server.post(`/v1/projects/${teamId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(payload);

        expect(response.status).toBe(201); 
    });

    it("should fetch all project under a team and respond with 200 ok", async() => {
        const teamId = "QAh847VAJF";

        const response = await server.get(`/v1/projects/${teamId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(200); 
        expect(response.body).toHaveProperty("projects"); 
        expect(response.body["projects"]).toBeInstanceOf(Array); 
        expect(response.body["projects"].length).toBeGreaterThanOrEqual(0); 
    });

    it("should invite user with by userIds or userId and respond with 200 ok", async() => {
        const projectId = "9TCx68GT5T";
        const payload = {
                userIds: [
                    "IdDZPK9dJI"
                ]
        }

        const response = await server.post(`/v1/projects/${projectId}/invite`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(payload);

        expect(response.status).toBe(200); 
    });
})