import { app } from "../src/app";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

const server = supertest(app);

let authToken;
describe("Tasks Routes", () => {
    beforeAll(async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passwd@1234"
        }

        const response = await server.post("/v1/users/login").send(loginCreds);

        authToken = response.body["token"];
    });

    it("Should create new task under a projectId and respond with 201 created", async() => {
        const projectId = "9TCx68GT5T";

        const payload = {
            "title": "Taskname-1",
            "dueDate": "23/07/2025",
            "description": "This is a test description from tester."
        }

        const response = 
            await server.post(`/v1/tasks/${projectId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(payload);
        
        expect(response.status).toBe(201);
    });
    
    it("Should fetch task under a projectId of loggedIn user and respond with 200 Ok", async() => {
        const projectId = "9TCx68GT5T";

        const response = 
            await server.get(`/v1/tasks/${projectId}`)
                .set("Authorization", `Bearer ${authToken}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tasks");
        expect(response.body["tasks"]).toBeInstanceOf(Array);
        expect(response.body["tasks"].length).toBeGreaterThanOrEqual(0);
    });
    
    it("Should update task under a taskId for loggedIn user and respond with 200 Ok", async() => {
        const taskId = "ml9_U8aNbo";

        const payload = {
            title: "Taskname-191"
        }
        const response = 
            await server.patch(`/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(payload)
        
        expect(response.status).toBe(200);
    });
    
    it("Should assign task under a taskId to a user and respond with 200 Ok", async() => {
        const taskId = "ml9_U8aNbo";

        const payload = {
            userId: "dfiblAoYiu"
        }
        const response = 
            await server.post(`/v1/tasks/${taskId}/assign`)
                .set("Authorization", `Bearer ${authToken}`)
                   .send(payload)
        
        expect(response.status).toBe(200);
    });
    
    it("Should fetch matching tasks under a projectId via text search and respond with 200 Ok", async() => {
        const projectId = "9TCx68GT5T";

        const payload = {
            text: "test description"
        }
        const response = 
            await server.post(`/v1/tasks/${projectId}/search`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(payload)
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tasks");
        expect(response.body["tasks"]).toBeInstanceOf(Array);
        expect(response.body["tasks"].length).toBeGreaterThanOrEqual(0);
    });
    
    it("Should add comment under a taskId and respond with 200 Ok", async() => {
        const taskId = "DEKY5JbMdP";

        const payload = {
            comment: "This is a new comment2 from tester"
        }
        const response = 
            await server.post(`/v1/tasks/${taskId}/comment`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(payload)
        
        expect(response.status).toBe(200);
    });

});