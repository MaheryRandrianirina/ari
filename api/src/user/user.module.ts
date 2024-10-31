import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/register/schemas/user.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
    global: true,
    useFactory: (configService: ConfigService)=> ({
      secret: configService.get<string>("JWT_SECRET"),
      signOptions: { expiresIn: "60s"},
    }),
    inject: [ConfigService]
  }), MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
