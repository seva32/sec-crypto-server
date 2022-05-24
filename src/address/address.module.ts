import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AddressModel } from './schemas/address.schema';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { IsAuthenticated } from 'src/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/utils/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Address', schema: AddressModel }]),
    UserModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticated).forRoutes(AddressController);
  }
}
