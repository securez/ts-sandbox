import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Zone } from "./Zone";

@Entity("zones_tree")
export class ZoneTree {
  @PrimaryColumn({
    name: "ancestor_id",
    primaryKeyConstraintName: "zones_tree_pk",
    foreignKeyConstraintName: "zones_tree_ancestor_fk",
  })
  ancestorId!: number;

  @PrimaryColumn({
    name: "descendant_id",
    primaryKeyConstraintName: "zones_tree_pk",
    foreignKeyConstraintName: "zones_tree_descendant_fk",
  })
  descendantId!: number;

  @ManyToOne(type => Zone, zone => zone.id)
  @JoinColumn({
    name: "ancestor_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "zones_tree_ancestor_fk",
  })
  ancestor!: Zone;

  @ManyToOne(type => Zone, zone => zone.id)
  @JoinColumn({
    name: "descendant_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "zones_tree_descendant_fk",
  })
  descendant!: Zone;

  @Column({ name: "length", default: 0 })
  length!: number;
}
