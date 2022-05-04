import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}