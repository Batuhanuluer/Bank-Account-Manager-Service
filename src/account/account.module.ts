import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config(); 

@Module({
  imports :[
    TypeOrmModule.forFeature([Account]),
    ClientsModule.register([
      {
        name: process.env.RBTMQ_SERVICENAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RBTMQ_URL],
          queue: process.env.RBTMQ_QUEUENAME,
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
