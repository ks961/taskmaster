import { config } from "../configs";
import { DIEngine } from "../libs/di";
import { Invite } from "../models/invite.model";
import { ProjectInvite } from "../models/project-invite.model";
import { Project } from "../models/project.model";
import { Task, TTask } from "../models/task.model";
import { Team, TTeam } from "../models/team.model";
import { User, TUser } from "../models/user.model";
import { MongoRepository } from "../repositories/mongo";
import { InviteRepository } from "../repositories/mongo/invite/invite.repository";
import { ProjectInviteRepository } from "../repositories/mongo/project-invite/project-invite.repository";
import { ProjectRepository } from "../repositories/mongo/project/project.repository";
import { TaskRepository } from "../repositories/mongo/task/task.repository";
import { TeamRepository } from "../repositories/mongo/team/team.repositoty";
import { UserRepository } from "../repositories/mongo/user/user.repository";
import { AuthService } from "../services/auth";
import { ChatAI } from "../services/chat-ai/ChatAI";
import { ChatGPTService, GPTResponse } from "../services/chat-ai/chatgpt-service";
import { InviteService } from "../services/invite";
import { MemDB } from "../services/memdb";
import { RedisService } from "../services/memdb/redis-service";
import { BcryptJSService } from "../services/password/bcryptjs-service";
import { ProjectService } from "../services/project";
import { ProjectInviteService } from "../services/project-invite";
import { SockMap } from "../services/sock-map";
import { TaskService } from "../services/task";
import { TeamService } from "../services/team";
import { JWTService } from "../services/token/jwt-service";
import { MulterService } from "../services/upload/multer-service";
import { UserService } from "../services/users";

export function setupDI(DI: DIEngine) {

    DI.registerSingleton(
        UserRepository,
        () => new UserRepository(
            new MongoRepository(User)
        )
    );

    DI.registerSingleton(
        TeamRepository,
        () => new TeamRepository(
            new MongoRepository(Team)
        )
    );

    DI.registerSingleton(
        BcryptJSService,
        () => new BcryptJSService()
    );

    DI.registerSingleton(
        JWTService,
        () => new JWTService()
    );

    DI.registerSingleton(
        UserService,
        () => new UserService(
            DI.resolve(UserRepository<TUser>)
        )
    );

    DI.registerSingleton(
        AuthService,
        () => new AuthService(
            DI.resolve(UserRepository<TUser>),
            DI.resolve(BcryptJSService)
        )
    );

    DI.registerSingleton(
        TeamService,
        () => new TeamService(
            DI.resolve(TeamRepository<TTeam>) 
        )
    );

    DI.registerSingleton(
        InviteRepository,
        () => new InviteRepository(
            new MongoRepository(Invite)
        )
    );

    DI.registerSingleton(
        InviteService,
        () => new InviteService(
            DI.resolve(InviteRepository) 
        )
    );

    DI.registerSingleton(
        ProjectRepository,
        () => new ProjectRepository(
            new MongoRepository(Project)
        )
    );

    DI.registerSingleton(
        ProjectService,
        () => new ProjectService(
            DI.resolve(ProjectRepository) 
        )
    );

    DI.registerSingleton(
        ProjectInviteRepository,
        () => new ProjectInviteRepository(
            new MongoRepository(ProjectInvite)
        )
    );

    DI.registerSingleton(
        ProjectInviteService,
        () => new ProjectInviteService(
            DI.resolve(ProjectInviteRepository)
        )
    );

    DI.registerSingleton(
        TaskRepository,
        () => new TaskRepository(
            new MongoRepository(Task)
        )
    );

    DI.registerSingleton(
        TaskService,
        () => new TaskService(
            DI.resolve(TaskRepository<TTask>)
        )
    );

    DI.registerSingleton(
        MulterService,
        () => new MulterService()
    );

    DI.registerSingleton(
        MemDB,
        () => new MemDB(
            new RedisService(config.REDIS_URI)
        )
    );

    DI.registerSingleton(
        ChatAI,
        () => new ChatAI<GPTResponse>(
            new ChatGPTService(config.OPENAI_KEY)
        )
    );

    DI.registerSingleton(
        SockMap,
        () => new SockMap()
    );
}

export const DI = new DIEngine();

setupDI(DI);