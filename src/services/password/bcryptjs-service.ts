import bcrypt from "bcryptjs";
import { IPasswordService } from ".";
import { config } from "../../configs";

export class BcryptJSService implements IPasswordService {

    async hash(plainTextPass: string): Promise<string> {
        return await bcrypt.hash(
            plainTextPass, config.SALT_ROUNDS
        );
    }
    async verify(plainTextPass: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(
            plainTextPass,
            hash
        );
    }
}