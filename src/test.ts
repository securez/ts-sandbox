import { AppDataSource } from "./orm/data-source";
import { User } from "./orm/entity/User";
import { Group } from "./orm/entity/Group";

AppDataSource.initialize()
  .then(async () => {
    const em = AppDataSource.manager;
    const userRepository = em.getRepository(User);

    const users = await userRepository.find();

    console.table(users);

    const g1 = new Group();
    g1.name = "g1";
    await em.save(g1);

    const g11 = new Group();
    g11.name = "g11";
    // g11.parent = g1;
    // BUG: TreeParent g11 will not store parent on closure table only on g11 entity
    g11.parentId = g1.id; 
    await em.save(g11);

    const g12 = new Group();
    g12.name = "g12";
    g12.parent = g1;
    await em.save(g12);









  })
  .catch((error) => console.log(error));
