import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Driver
{
    @PrimaryColumn()
    driver_id: number;

    @Column()
    driver_name: string;

    @Column()
    driver_number: number;

    @Column()
    driver_region: string;
}