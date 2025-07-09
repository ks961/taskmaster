import "@d3vtool/strict-env/setup"
import express from "express";
import { config } from "./configs";
import { defaultErrorHandler } from "./errors/error-handlers/default-error-handler";

export const app = express();

app.use(defaultErrorHandler);

app.listen(config.PORT);
