import "express-session";
declare module "express-session" {
    interface Session {
        passport: any;
        user: any;
    }
}