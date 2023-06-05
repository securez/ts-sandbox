import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ZoneTree } from "./ZoneTree";

@Entity("zones")
export class Zone {
  @PrimaryGeneratedColumn({
    name: "zone_id",
    primaryKeyConstraintName: "zones_pk",
  })
  id!: number;

  @Column({ name: "parent_zone_id", nullable: true })
  parentId!: number;

  @ManyToOne(() => Zone, (zone) => zone.id)
  @JoinColumn({
    name: "parent_zone_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "zones_parent_fk",
  })
  parent!: Zone;

  @OneToMany((type) => ZoneTree, (zoneTree) => zoneTree.ancestor)
  ancestors!: ZoneTree[];

  @OneToMany((type) => ZoneTree, (zoneTree) => zoneTree.descendant)
  descendants!: ZoneTree[];

  @Column({ name: "name" })
  name!: string;
}
