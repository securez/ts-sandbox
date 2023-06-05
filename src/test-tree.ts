import { ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "./orm/data-source";
import { Zone } from "./orm/entity/Zone";

class CustomRepository<T extends ObjectLiteral> extends Repository<T> {}

AppDataSource.initialize()
  .then(async () => {
    const em = AppDataSource.manager;

    const repository = new CustomRepository<Zone>(Zone, em, em.queryRunner);

    // Select a zone and all of its descendants
    const zoneWithDescendants = await repository.find({
      relations: {
        ancestors: true,
      },
      where: {
        id: 1,
      },
    });

    console.log(
      "Descendants: " + JSON.stringify(zoneWithDescendants, undefined, 2)
    );

    // Select a zone and all of its ancestors
    const zoneWithAncestors = await repository.find({
      relations: {
        descendants: true,
      },
      where: {
        id: 4,
      },
    });

    console.log(
      "Ancestors: " + JSON.stringify(zoneWithAncestors, undefined, 2)
    );

    // Get all roots and its decendands order by name
    const zoneWithDescendantOrder = (
      await repository
        .createQueryBuilder("zone")
        .select(["zone", "zt"])
        .innerJoin("zone.descendants", "zt")
        .innerJoin("zt.ancestor", "rt")
        .where("rt.parent_zone_id IS NULL")
        .orderBy("rt.name", "ASC")
        .addOrderBy("zt.length", "ASC")
        .addOrderBy("zone.parentId", "ASC")
        .addOrderBy("zone.name", "ASC")
        .getMany()
    ).map((zone) => {
      return {
        id: zone.id,
        parentId: zone.parentId,
        name: zone.name,
        depth: zone.descendants[0].length,
      };
    });

    console.log(
      "Descendants Order:  " +
        JSON.stringify(zoneWithDescendantOrder, undefined, 2)
    );

    // Select node 3 and all descendants in order
    const nodeWithDescendantOrder = (
      await repository
        .createQueryBuilder("zone")
        .select(["zone", "zt"])
        .innerJoin("zone.ancestors", "zt")
        .where("zt.descendant_id = 3")
        .orderBy("zt.length", "ASC")
        .addOrderBy("zt.length", "ASC")
        .addOrderBy("zone.name", "ASC")
        .getMany()
    ).map((zone) => {
      return {
        id: zone.id,
        parentId: zone.parentId,
        name: zone.name,
        depth: zone.ancestors[0].length,
      };
    });

    console.log(
      "Descendants Order:  " +
        JSON.stringify(nodeWithDescendantOrder, undefined, 2)
    );
  })
  .catch((error) => console.log(error));
