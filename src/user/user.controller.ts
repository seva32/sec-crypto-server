import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Param,
  NotFoundException,
  Put,
  Query,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('auth/signup')
  async Signup(@Res() response, @Body() createUserDTO: CreateUserDTO) {
    const newUSer = await this.userService.signup(createUserDTO);
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }

  @Post('auth/signin')
  async SignIn(@Res() response, @Body() user: User) {
    const token = await this.userService.signin(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token);
  }

  @Get('users')
  async getAllUsers(@Res() response) {
    const users = await this.userService.getAllUser();
    return response.status(HttpStatus.OK).json(users);
  }

  @Get('user/:userId')
  async getUser(@Res() response, @Param('userId') userId) {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new NotFoundException('User does not exists!');
    }

    return response.status(HttpStatus.OK).json(user);
  }

  @Get('populate-addresses')
  async getUserPopulated(@Req() request, @Res() response) {
    if (!request.user) throw new NotFoundException('You must be logged in.');

    const user = await this.userService.findByIdAndPopulate(request.user);

    if (!user) {
      throw new NotFoundException('User does not exists!');
    }

    return response.status(HttpStatus.OK).json(user);
  }

  @Put('update')
  async updateUser(
    @Res() response,
    @Query('userId') userId,
    @Body() createUserDTO,
  ) {
    const user = await this.userService.updateUser(userId, createUserDTO);
    if (!user) {
      throw new NotFoundException('User does not exists!');
    }

    return response.status(HttpStatus.OK).json({
      message: 'User has been updated successfully!',
      user,
    });
  }

  @Delete('delete')
  async deleteUser(@Res() response, @Query('userId') userId) {
    const user = await this.userService.deleteUser(userId);

    if (!user) {
      throw new NotFoundException('User does not exists!');
    }

    return response.status(HttpStatus.OK).json({
      message: 'User has been successfully deleted',
      user,
    });
  }
}
