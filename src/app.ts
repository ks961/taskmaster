import "@d3vtool/strict-env/setup"
import { DI } from "./di";
import express from "express";
import { Database } from "./db";
import { config } from "./configs";
import { DIEngine } from "./libs/di";
import { v1Router } from "./routes/v1";
import { defaultErrorHandler } from "./errors/error-handlers/default-error-handler";

export const app = express();

app.use(express.json());

app.use(DIEngine.scopeMiddleware(DI));

app.use("/v1", v1Router);

app.use(defaultErrorHandler);

async function startServer() {
    await Database.connect(config.MONGO_URI);
    app.listen(config.PORT);
}

startServer();
