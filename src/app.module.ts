import path from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { AppService } from './app.service';
import { MONGO_URI } from './utils/constants';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UserModule,
    AddressModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
