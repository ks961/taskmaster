import "@d3vtool/strict-env/setup"
import { DI } from "./di";
import http from "node:http";
import express from "express";
import { Database } from "./db";
import { config } from "./configs";
import { DIEngine } from "./libs/di";
import { v1Router } from "./routes/v1";
import { defaultErrorHandler } from "./errors/error-handlers/default-error-handler";
import { Server, Socket } from "socket.io";
import { TUser } from "./models/user.model";
import { SockMap } from "./services/sock-map";

export const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.use(DIEngine.scopeMiddleware(DI));

app.use("/v1", v1Router);

app.use(defaultErrorHandler);

io.on("connection", (socket: Socket) => {

    /**
     * After client initiates connection, they will be expected
     * to send this first event with their user id as payload. 
     */
    socket.on("init:userid", (payload) => {
        try {
            const data = JSON.parse(payload) as { userId: TUser["userId"] };
            if(!("userId" in data)) {
                throw new Error();
            }

            const sockMap = DI.resolve(SockMap);
            sockMap.set(data.userId, socket);
        } catch {
            /**
             * There client is expected to have a global socket.io event
             * to receive error messages at 'client:error' event..
            */
            socket.emit("client:error", "Bad userid payload")
        }
    });
});


async function startServer() {
    await Database.connect(config.MONGO_URI);
    app.listen(config.PORT);
}

startServer();

