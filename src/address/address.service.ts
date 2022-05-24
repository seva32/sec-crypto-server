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

  async addAddress(
    userId: string,
    createAddressDTO: CreateAddressDTO,
  ): Promise<Address> {
    try {
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
        throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
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
    address,
    createAddressDTO: CreateAddressDTO,
  ): Promise<Address> {
    const filter = { address };
    const update = createAddressDTO;
    return this.addressModel.findOneAndUpdate(filter, update, {
      new: true,
    });
  }

  async deleteAddress(addressId): Promise<any> {
    return this.addressModel.findByIdAndRemove(addressId);
  }
}
