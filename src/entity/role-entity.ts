import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permissions } from "./permission-entity";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permissions)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {name: 'role_id', referencedColumnName: 'id'},
    inverseJoinColumn: {name: 'permission_id', referencedColumnName: 'id'}
  })
  permissions: Permissions[];
}