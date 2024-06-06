import express, {Express, Request, Response} from 'express';
import {apiRouter} from './routes';
import {mongoose} from '@typegoose/typegoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import cors from 'cors';
import {UserModel} from './models/User';
import {CommunityModel} from './models/Community';

const app: Express = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const dbInit = async () => {
  const mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  await mongoose.connect(uri);

  console.log('Connected to MongoDB');

  await UserModel.deleteMany({});
  await CommunityModel.deleteMany({});

  // seed data

  const community1 = await CommunityModel.create({
    name: 'Test Community',
    logo: 'https://via.placeholder.com/40',
  });

  const community2 = await CommunityModel.create({
    name: 'Test Community 2',
    logo: 'https://via.placeholder.com/40',
  });

  const community3 = await CommunityModel.create({
    name: 'Test Community 3',
    logo: 'https://via.placeholder.com/40',
  });

  const user1 = await UserModel.create({
    email: 'test@test.com',
    passwordHash: '$2b$10$/uK3x3q0y1yv.l8.y9x.uO.xX1w.w1.g.o.t.k.j.h.q.a.b.c',
    community: community2,
    experiencePoints: [
      {points: 500, timestamp: new Date()},
      {points: 200, timestamp: new Date()},
      {points: 300, timestamp: new Date()},
    ],
  });

  const user2 = await UserModel.create({
    email: 'test2@test.com',
    passwordHash: '$2b$10$/uK3x3q0y1yv.l8.y9x.uO.xX1w.w1.g.o.t.k.j.h.q.a.b.c',
    community: community1,
    experiencePoints: [{points: 100, timestamp: new Date()}],
  });

  const user3 = await UserModel.create({
    email: 'test3@test.com',
    passwordHash: '$2b$10$/uK3x3q0y1yv.l8.y9x.uO.xX1w.w1.g.o.t.k.j.h.q.a.b.c',
    community: community1,
    experiencePoints: [
      {points: 100, timestamp: new Date()},
      {points: 200, timestamp: new Date()},
      {points: 300, timestamp: new Date()},
      {points: 100, timestamp: new Date()},
    ],
  });

  const user4 = await UserModel.create({
    email: 'test4@test.com',
    passwordHash: '$2b$10$/uK3x3q0y1yv.l8.y9x.uO.xX1w.w1.g.o.t.k.j.h.q.a.b.c',
    community: community3,
    experiencePoints: [
      {points: 100, timestamp: new Date()},
      {points: 200, timestamp: new Date()},
      {points: 300, timestamp: new Date()},
      {points: 100, timestamp: new Date()},
    ],
  });
};

dbInit()
  .then(() => {})
  .catch(async (err) => {
    console.log(err);
  });
app.use('/', apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
