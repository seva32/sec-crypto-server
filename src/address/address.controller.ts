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
  Delete,
  HttpException,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDTO } from '../address/dto/create-address.dto';

@Controller('api/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('create')
  async addAddress(
    @Req() request,
    @Res() response,
    @Body() createAddressDTO: CreateAddressDTO,
  ) {
    try {
      const user = await this.addressService.addAddress(
        request.user,
        createAddressDTO,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Address has been added successfully to user',
        address: createAddressDTO,
        user,
      });
    } catch (e) {
      throw new NotFoundException('User does not exist');
    }
  }

  @Get('addresses')
  async getAllAddresses(@Res() response) {
    const addresses = await this.addressService.getAllAddresses();
    return response.status(HttpStatus.OK).json(addresses);
  }

  @Get('address/:addressId')
  async getAddress(@Res() response, @Param('addressId') addressId) {
    const address = await this.addressService.getAddress(addressId);
    if (!address) {
      throw new NotFoundException('Address does not exists!');
    }

    return response.status(HttpStatus.OK).json(address);
  }

  @Put('update')
  async updateAddress(@Res() response, @Body() createAddressDTO) {
    const address = await this.addressService.updateAddress(
      createAddressDTO.address,
      createAddressDTO,
    );
    if (!address) {
      throw new NotFoundException('Address does not exists!');
    }

    return response.status(HttpStatus.OK).json({
      message: 'Address has been updated successfully!',
      address,
    });
  }

  @Delete('delete/:addressId')
  async deleteAddress(
    @Req() request,
    @Res() response,
    @Param('addressId') addressId,
  ) {
    try {
      const address = await this.addressService.deleteAddress(
        request.user,
        addressId,
      );
      if (!address) {
        throw new NotFoundException('Address does not exists!');
      }

      return response.status(HttpStatus.OK).json({
        message: 'Address has been successfully deleted',
        address,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException(
        "We couldn't process your request",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
