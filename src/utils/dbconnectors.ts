import { createConnection } from 'typeorm';

const initConnection = () =>
  createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '123qwe',
    database: 'AnimalKeeper',
    entities: ['./dist/src/models/*.js'],
    synchronize: true,
  });

export default initConnection;
