import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Account{

    @PrimaryGeneratedColumn()
    id :number;

    @Column()
    accountnumber : string;

    @Column()
    price : number;

    @Column()
    phone : string; 

    @Column()
    firstname : string;

    @Column()
    lastname : string;
}