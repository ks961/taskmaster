
export interface IPasswordService {
    hash(plainTextPass: string): Promise<string>;
    verify(plainTextPass: string, hash: string): Promise<boolean>;
};