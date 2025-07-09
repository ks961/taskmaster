import { makeReadonly } from "../libs/utils";

export const config = makeReadonly({
    PORT: Number(process.env.PORT) || 3000,
});
