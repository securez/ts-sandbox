import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";

@Entity("groups")
@Tree("closure-table", {
  closureTableName: "groups_tree",
  ancestorColumnName: (column) => "ancestor_" + column.propertyName,
  descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class Group {
  @PrimaryGeneratedColumn({
    name: "group_id",
    primaryKeyConstraintName: "groups_group_pk",
  })
  id!: number;

  @Column({ name: "name" })
  name!: string;

  @TreeChildren()
  children!: Group[];

  // BUG: This column can't be defined for TreeParent
  @Column({ name: "group_parent_id", nullable: true })
  @Index("groups_parent_idx")
  parentId!: number;
  
  @JoinColumn({
    name: "group_parent_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "groups_parent_fk",
  })
  @TreeParent()
  parent!: Group;
}
