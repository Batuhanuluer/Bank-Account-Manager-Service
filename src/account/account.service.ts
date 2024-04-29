import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Redis from 'ioredis';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { User } from './user.dto';
import { ClientProxy } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();  

@Injectable()
export class AccountService {
    private readonly redisClient: Redis.Redis;

    constructor(
      @InjectRepository(Account) private readonly accountRepository : Repository<Account>,
      @Inject('ACCOUNT_SERVICE') private readonly client : ClientProxy,
    ){
        this.redisClient = new Redis.Redis({
            username : process.env.REDIS_USERNAME,
            password : process.env.REDIS_PASSWORD,
            host: process.env.REDIS_HOST,
            port: 15166
          });
    }

    async all(){
      return await this.accountRepository.find();
    }

    async createNewAccount(userphone : string){

        try {
            console.log(userphone);
            
            const user = await this.redisClient.get(userphone);


            const userJson : User = JSON.parse(user)

            if (user) {
              
              const account = new Account();
              account.accountnumber = await this.createAccountNumber(); 
              account.phone = userJson.phone;
              account.firstname = userJson.firstname;
              account.lastname = userJson.lastname;
              account.price = 0;

              await this.accountRepository.save(account);

              const mbData = {
                accountnumber : account.accountnumber, 
                accountprice : account.price
              }

              this.client.emit('NewAccount',mbData);


              return account;
            } else {
              throw new Error('User not found');
            }
          } catch (error) {
            console.error('Error retrieving data:', error.message);
            throw error;
          }
    }

    async moneyInflow(accountNumber : string, amount: number){

        // Hesabı veritabanında bulun
        const account = await this.accountRepository.findOne({
          where: { accountnumber: accountNumber },
        });

        if (!account) {
          // Hesap bulunamazsa, uygun bir hata mesajı döndür
          throw new NotFoundException(`Account with number ${accountNumber} not found.`);
        }

        // Mevcut bakiyeyi güncelleyin
        account.price += amount;

        const mbData = {
          accountnumber : account.accountnumber, 
          accountprice : account.price
        }
        

        this.client.emit('AccountPriceChaned',mbData);
      
        await this.accountRepository.save(account);

        return account;     
      }

      async moneyOutflow(accountNumber : string , amount : number){
                // Hesabı veritabanında bulun
                const account = await this.accountRepository.findOne({
                  where: { accountnumber: accountNumber },
                });
        
                if (!account) {
                  
                  throw new NotFoundException(`Account with number ${accountNumber} not found.`);
                }
        
                if(account.price < amount){
                  throw new NotFoundException(`Account with number ${accountNumber} have not enough balance.`);
                }
           
                account.price -= amount;

                const mbData = {
                  accountnumber : account.accountnumber, 
                  accountprice : account.price
                }
                this.client.emit('AccountPriceChaned',mbData);

               
                await this.accountRepository.save(account);
        
                return account;  
      }

    async createAccountNumber(){
      let accountnumber: string;
    
    
      while (true) {

        accountnumber = Math.floor(Math.random() * Math.pow(10, 16)).toString();
    
        
        const existingAccount = await this.accountRepository.findOne({
          where: { accountnumber },
        });
    
    
        if (!existingAccount) {
          break;  
        }
      }
    
      return accountnumber;  
    }
    
}
