import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UserGuard } from 'src/user/user.guard';
import { AdminGuard } from 'src/admin/admin.guard';
import { Response } from 'express';
import { Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskResponsibleDto } from './dto/create-task-responsible.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {

    constructor(private readonly tasksService: TasksService) {}

    @Get()
    @UseGuards(UserGuard, AdminGuard)
    async getTasks(@Res() res: Response) {
        const tasks = await this.tasksService.getTasks();
        res.json({
            success: true,
            tasks
        });
    }

    @Get("/user/:userid")
    @UseGuards(UserGuard)
    async getUserTasks(
        @Param() params: {userid:string}, 
        @Res() res: Response
    ) {
        const {userid} = params;
        
        const tasks = await this.tasksService.getUserTasks(new Types.ObjectId(userid));
        res.json({
            success: true,
            tasks
        });
    }

    @Delete("/:taskid")
    @UseGuards(UserGuard, AdminGuard)
    async deleteTask(
        @Param() params: {taskid:string}, 
        @Res() res: Response
    ) {
        const {taskid} = params;
        
        await this.tasksService.deleteTask(new Types.ObjectId(taskid));
        
        res.json({
            success: true
        });
    }

    @Post("/new")
    @UseGuards(UserGuard, AdminGuard)
    async createTask(
        @Body() createTaskDTO: CreateTaskDto, 
        @Res() res: Response
    ) {
        const newRegistredTask = await this.tasksService.createTask(createTaskDTO);
        
        res.json({
            success: true,
            message: "New task has been saved",
            task: newRegistredTask
        });
    }

    @Post("/:taskid/user")
    @UseGuards(UserGuard, AdminGuard)
    async attachTaskResponsible(
        @Body() taskResponsibleDto: CreateTaskResponsibleDto,
        @Param() params: {taskid:string},
        @Res() res: Response
    ) {
        const {taskid} = params;

        try {
            await this.tasksService.attachResponsible(new Types.ObjectId(taskid), new Types.ObjectId(taskResponsibleDto.user_id));
            
            res.json({
                success: true,
                message: "A responsible has been attached to this task"
            });
        }catch(e) {
            res.status(500).json({
                success: false,
                message: "Error has occured while attaching responsible for this task. Please try again."
            });
        }
    }

    @Put("/:taskid")
    @UseGuards(UserGuard)
    async updateTask(
        @Param() params: {taskid:string}, 
        @Body() updateTask:UpdateTaskDto,
        @Res() res: Response
    ) {
        const {taskid} = params;
        try {
            await this.tasksService.updateTask(taskid, updateTask);
            
            res.json({success: true});
        }catch(e) {
            res.status(500).json({
                success: false,
                message: "Error has occured while updating the task status. Please try again"
            });
        }
        
    }
}
