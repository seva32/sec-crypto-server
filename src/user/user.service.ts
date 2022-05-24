import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signup(user: CreateUserDTO): Promise<User | HttpException> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (foundUser) {
      return new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      fullname: user.fullname,
      email: user.email,
      password: hash,
    };
    const newUser = new this.userModel(reqBody);
    return newUser.save();
  }

  async signin(
    user: User,
    jwt: JwtService,
  ): Promise<{ token: string } | HttpException> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(user.password, password)) {
        const payload = { userId: foundUser._id };
        return {
          token: jwt.sign(payload),
        };
      }
      return new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new HttpException(
      'Incorrect username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async getOne(userId): Promise<User> {
    return this.userModel.findOne({ _id: userId }).exec();
  }

  async getAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUser(userId): Promise<User> {
    return this.userModel.findById(userId);
  }

  async updateUser(userId, createUserDTO: CreateUserDTO): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, createUserDTO, {
      new: true,
    });
  }

  async deleteUser(userId): Promise<any> {
    return this.userModel.findByIdAndRemove(userId);
  }

  async findByIdAndUpdate(id, update, options): Promise<any> {
    return this.userModel.findByIdAndUpdate(id, update, options);
  }

  async findByIdAndPopulate(id): Promise<any> {
    return this.userModel.findById(id).populate('addresses');
  }
}
