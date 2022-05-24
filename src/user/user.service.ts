import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AddressService } from 'src/address/address.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UserService implements OnModuleInit {
  private addressService: AddressService;
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.addressService = this.moduleRef.get(AddressService, { strict: false });
  }

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
  ): Promise<{ token: string; user: string } | HttpException> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(user.password, password)) {
        const payload = { userId: foundUser._id };
        return {
          token: jwt.sign(payload),
          user: foundUser._id.toString(),
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

  async updateUser(
    userId: string,
    createUserDTO: CreateUserDTO,
  ): Promise<User | HttpException> {
    const currentUser = await this.getUser(userId);
    if (currentUser.addresses.length > createUserDTO.addresses.length) {
      const addressToDelete: string[] = currentUser.addresses.reduce(
        (acc: string[], userAddress: ObjectId): string[] => {
          const dto = [];
          createUserDTO.addresses.forEach((a) => dto.push(a));
          if (!dto.includes(userAddress.toString())) {
            acc.push(userAddress.toString());
            return acc;
          }
          return acc;
        },
        [],
      );

      try {
        await Promise.all(
          addressToDelete.map((address) =>
            this.addressService.deleteAddress(userId, address),
          ),
        );

        return this.userModel.findByIdAndUpdate(userId, createUserDTO, {
          new: true,
        });
      } catch (e) {
        console.error(e);
        return new HttpException(
          'We could not process this update',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      return this.userModel.findByIdAndUpdate(userId, createUserDTO, {
        new: true,
      });
    }
  }

  async deleteUserAddress(userId: string, addressId: string): Promise<any> {
    return this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $pull: {
          address: addressId,
        },
      },
    );
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
