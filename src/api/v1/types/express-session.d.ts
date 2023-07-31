import "express-session";

// Add passport and user to the req.session object
declare module "express-session" {
    interface Session {
        passport: any;
        user: any;
    }
}