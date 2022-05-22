import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModule } from './employee/employee.module';
import path from 'path';
import { MONGO_URI } from './utils/constants';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    EmployeeModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
