import { TaskStatus } from "./TaskStatus";
import { User } from "./User";

export class Task {
    id?: number;
    title: string;
    description: string;
    userId: number;
    user: User;
    status: TaskStatus;

    constructor(data: { id: number, title: string, description: string, userId: number, user: User, status: TaskStatus }) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.userId = data.userId;
        this.user = data.user;
        this.status = data.status;
    }
}