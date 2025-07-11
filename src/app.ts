import "@d3vtool/strict-env/setup"
import express from "express";
import { config } from "./configs";
import { v1Router } from "./routes/v1";
import { connectDB } from "./configs/db";
import { defaultErrorHandler } from "./errors/error-handlers/default-error-handler";

export const app = express();

app.use(express.json());

app.use("/v1", v1Router);

app.use(defaultErrorHandler);

app.listen(config.PORT, async() => {
    await connectDB();
});
