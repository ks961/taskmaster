import { JwtClaim } from "@d3vtool/utils/dist/types/jwt/jwt";

export type CustomClaims = Record<string, string>;

export interface ITokenService {
    createAccessToken(
        customClaims: Record<string, string>,
        claims?: JwtClaim,
    ): Promise<string>,

    verifyToken<T extends CustomClaims>(token: string): Promise<T>
}