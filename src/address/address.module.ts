import { Module } from '@nestjs/common';
import { AddressModel } from './schemas/address.schema';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Address', schema: AddressModel }]),
    UserModule,
  ],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
