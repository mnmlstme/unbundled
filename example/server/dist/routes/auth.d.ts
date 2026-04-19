import { NextFunction, Request, Response } from "express";
export type JwtPayload = {
    username: string;
};
export type AuthenticatedRequest = Request & {
    jwtPayload: JwtPayload;
};
declare const router: import("express-serve-static-core").Router;
export declare function authenticateUser(req: Request, res: Response, next: NextFunction): void;
export declare function authorizeUser(checkFn: (req: Request, username: string) => boolean): (req: Request, res: Response, next: NextFunction) => void;
export default router;
