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
        descendants: true
      },
      where: {
        id: 4,
      },
    });

    console.log(
      "Ancestors: " + JSON.stringify(zoneWithAncestors, undefined, 2)
    );

    // Get all roots and its decendands order by name
    /*
    SELECT
        z.*,
        zt.length 
    FROM
        zones z
    JOIN 
        zones_tree zt ON
        z.zone_id = zt.descendant_id
    JOIN zones rt ON
        rt.zone_id = zt.ancestor_id
    WHERE
        rt.parent_zone_id IS NULL
    ORDER BY
        rt.name ASC,
        zt.length ASC,
        z.name ASC
    ;
    */
    const zoneWithDescendantOrder = await repository
      .createQueryBuilder("zone")
      .select(["zone", "zt"])
      .innerJoin("zone.descendants", "zt")
      .innerJoin("zt.ancestor", "rt")
      .where("rt.parent_zone_id IS NULL")
      .orderBy("rt.name", "ASC")
      .addOrderBy("zt.length", "ASC")
      .addOrderBy("zone.parentId", "ASC")
      .addOrderBy("zone.name", "ASC")
      .getMany();

    console.log(
      "Descendants Order:  " +
        JSON.stringify(zoneWithDescendantOrder, undefined, 2)
    );

    // Select node and all descendants in order
    const nodeWithDescendantOrder = await repository
      .createQueryBuilder("zone")
      .select(["zone", "zt"])
      .innerJoin("zone.ancestors", "zt")
      .where("zt.descendant_id = 3")
      .orderBy("zt.length", "ASC")
      .getMany();

    console.log(
      "Descendants Order:  " +
        JSON.stringify(nodeWithDescendantOrder, undefined, 2)
    );
  })
  .catch((error) => console.log(error));
