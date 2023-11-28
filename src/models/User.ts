import { Task } from "./Task";

export class User {
    id?: number;
    username: string;
    email: string;
    password: string;
    tasks: Task[];

    constructor(data: { id: number, username: string, email: string, password: string, tasks: Task[] }) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.tasks = data.tasks;
    }
}