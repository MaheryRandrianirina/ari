import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {

    constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>){}

    async getTasks() {
        return await this.taskModel.find()
    }

    async getUserTasks(userid:Types.ObjectId) {
        return await this.taskModel.find({user_id: userid});
    }

    async deleteTask(taskid: Types.ObjectId) {
        return await this.taskModel.deleteOne({id: taskid});
    }

    async createTask(taskDTO: CreateTaskDto) {
        const newTask = new this.taskModel({name: taskDTO.task});
        return await newTask.save();
    }

    async attachResponsible(taskid: Types.ObjectId, userid: Types.ObjectId) {
        return await this.taskModel.updateOne({_id: taskid}, {user_id: userid});
    }

    async updateTask(taskid:string, data: UpdateTaskDto) {
        return await this.taskModel.updateOne({_id: new Types.ObjectId(taskid)}, {...data})
    }
}
