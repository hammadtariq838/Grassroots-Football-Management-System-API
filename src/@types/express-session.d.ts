import * as expressSession from 'express-session';
declare module "express-session" {
	interface Session {
		user: any;
	}
}