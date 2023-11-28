"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
class Task {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.userId = data.userId;
        this.user = data.user;
        this.status = data.status;
    }
}
exports.Task = Task;
