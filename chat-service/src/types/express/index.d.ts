// custom.d.ts or types/express/index.d.ts
import { User } from './entities/user.entity'; // Adjust the import based on your project structure

declare module 'express' {
    export interface Request {
        user?: User;
    }
}
