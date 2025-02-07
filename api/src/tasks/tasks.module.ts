import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { User, UserSchema } from 'src/register/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}, {name: User.name, schema: UserSchema}])
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
