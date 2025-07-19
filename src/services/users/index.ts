import { TUser } from "../../models/user.model";
import { TUpdateUser } from "../../v-schemas/user";
import { UserRepository } from "../../repositories/mongo/user/user.repository";

export type UserProfile = Omit<TUser, "password">;

export class UserService {

    constructor(
        private readonly userRepo: UserRepository<TUser>
    ) {};
    
    async getUserById(userId: TUser["userId"]) {
        return await this.userRepo.findById(userId);
    }

    async getUsersByIds(ids: Array<TUser["userId"]>) {
        const promises = ids.map(mem => this.getUserById(mem));

        // add retry pattern here (on fail).
        const result = (await Promise.all(promises)).map(user => ({
            name: user?.name,
            email: user?.email,
            userId: user?.userId
        }));

        return result;
    }

    async updateUserById(
        userId: TUser["userId"],
        updateObj: Partial<TUser>
    ) {
        return await this.userRepo.update(userId, updateObj);
    }
};
