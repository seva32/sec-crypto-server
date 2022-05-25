import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './interfaces/address.interface';
import { CreateAddressDTO } from './dto/create-address.dto';
import { UserService } from 'src/user/user.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AddressService implements OnModuleInit {
  private userService: UserService;
  constructor(
    @InjectModel('Address') private readonly addressModel: Model<Address>,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }

  async addAddress(
    userId: string,
    createAddressDTO: CreateAddressDTO,
  ): Promise<Address> {
    try {
      if (
        await this.addressModel
          .findOne({ address: createAddressDTO.address })
          .exec()
      ) {
        throw new HttpException('Address already exist', HttpStatus.CONFLICT);
      }
      const user = await this.userService.getUser(userId);
      if (user) {
        const address = new this.addressModel(createAddressDTO);
        return address.save().then((docAddress) => {
          return this.userService.findByIdAndUpdate(
            userId,
            { $push: { addresses: docAddress._id } },
            { new: true, useFindAndModify: false },
          );
        });
      } else {
        throw new HttpException('Invalid user', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      throw new HttpException(
        e.message || 'We could not complete the transaction',
        e.status || HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAllAddresses(): Promise<Address[]> {
    return this.addressModel.find().exec();
  }

  async getAddress(addressId: string): Promise<Address> {
    return this.addressModel.findById(addressId);
  }

  async updateAddress(
    address: string,
    createAddressDTO: CreateAddressDTO,
  ): Promise<Address> {
    const filter = { address };
    const update = createAddressDTO;
    return this.addressModel.findOneAndUpdate(filter, update, {
      new: true,
    });
  }

  async deleteAddress(userId: string, addressId: string): Promise<any> {
    await this.userService.deleteUserAddress(userId, addressId);
    return this.addressModel.findByIdAndRemove(addressId);
  }
}
