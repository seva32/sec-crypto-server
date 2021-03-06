import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/utils/constants';
import { IsAuthenticated } from 'src/middleware/auth.middleware';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),
    forwardRef(() => AddressModule),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthenticated)
      .exclude(
        { path: 'api/user/users', method: RequestMethod.GET },
        { path: 'api/user/auth/signup', method: RequestMethod.POST },
        { path: 'api/user/auth/signin', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
