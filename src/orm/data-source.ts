import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import path from "path"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: false,
    migrationsRun: false,
    logging: 'all',
    entities: [ path.join(__dirname, '/entity/*.[jt]s') ],
    migrations: [ path.join(__dirname, '/migration/*.[jt]s') ],
    subscribers: [],
})
