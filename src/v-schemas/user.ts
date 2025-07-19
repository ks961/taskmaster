import { Validator, VInfer } from "@d3vtool/utils";
import { config } from "../configs";

export const user = {
    email: Validator.string().email(),
    name: Validator.string().minLength(4),
    password: Validator.string().password(),
    userId: Validator.string().minLength(config.ID_LENGTH),
}

export const vUserId = Validator.object({
    userId: user.userId
});

export const vSignupCreds = Validator.object({
    name: user.name,
    email: user.email,
    password: user.password,
});

export const vLoginCreds = Validator.object({
    email: user.email,
    password: user.password,
});

export const vUpdateUser = Validator.object({
    name: user.name.optional(),
    email: user.email.optional()
});

export type TUpdateUser = VInfer<typeof vUpdateUser>; 