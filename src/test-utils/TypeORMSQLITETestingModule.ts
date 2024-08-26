import { Contact } from '../user/contact/entities/contact.entity';
import { User } from '../user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [User, Contact],
    synchronize: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);