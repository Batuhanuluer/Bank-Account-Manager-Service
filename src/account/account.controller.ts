import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService : AccountService,
        
    ){}

    @Get()
    all(){
        return this.accountService.all();
    }

   @Post()
   async createNewAccount( 
        @Body('phone') userphone : string,
    ){
        return await this.accountService.createNewAccount(userphone);
    }

    @Post('inflow')
    async moneyInflow(
        @Body('accountnumber') accountNumber : string,
        @Body('price') price : number,
    )
    {
        return await this.accountService.moneyInflow(accountNumber,price);
    }

    @Post('outflow')
    async moneyOutflow(
        @Body('accountnumber') accountNumber : string,
        @Body('price') price : number,
    ){
        return await this.accountService.moneyOutflow(accountNumber,price);
    }

    @Post('transfer')
    async moneyTransfer(
        @Body('targetaccount') targetaccountNumber :string,
        @Body('price') price : number ,
        @Body('phone') userphone : string,
    ){
        return await this.accountService.moneyTransfer(targetaccountNumber, userphone ,price);
    }
}
