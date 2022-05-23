import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './interfaces/address.interface';
import { CreateAddressDTO } from './dto/create-address.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel('Address') private readonly addressModel: Model<Address>,
    private userService: UserService,
  ) {}

  async addAddress(createAddressDTO: CreateAddressDTO): Promise<Address> {
    try {
      const user = await this.userService.getUser(createAddressDTO.user);
      if (user) {
        const address = new this.addressModel(createAddressDTO);
        return address.save();
      }
    } catch (e) {
      console.error(e);
      throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
    }
  }
  async getAllAddresses(): Promise<Address[]> {
    return this.addressModel.find().exec();
  }

  async getAddress(addressId): Promise<Address> {
    return this.addressModel.findById(addressId);
  }

  async updateAddress(
    addressId,
    createAddressDTO: CreateAddressDTO,
  ): Promise<Address> {
    return this.addressModel.findByIdAndUpdate(addressId, createAddressDTO, {
      new: true,
    });
  }

  async deleteAddress(addressId): Promise<any> {
    return this.addressModel.findByIdAndRemove(addressId);
  }
}
