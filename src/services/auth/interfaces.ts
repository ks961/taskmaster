import { TUser } from "../../models/user.model";

export type TUserSignup   = Omit<TUser, "userId">;
export type TLoggedInUser = Omit<TUser, "password" | "pendingInvites">;
export type TUserLogin    = Pick<TUser, "email" | "password">;

export interface IAuthService {
    signup(user: TUserSignup): Promise<void>,
    login(creds: TUserLogin): Promise<TLoggedInUser>,
}

