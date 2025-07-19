import { TTeam } from "../../../models/team.model";
import { TUser } from "../../../models/user.model";


export interface IInviteRepo<T> {
    add(
        teamId: TTeam["teamId"],
        member: TUser["userId"]
    ): Promise<T>,  
};