import express, {Express} from 'express';
import {apiRouter} from './routes';
import {mongoose} from '@typegoose/typegoose';

import cors from 'cors';

const app: Express = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const startDb = async () => {
  await mongoose.connect('mongodb://localhost:27017');
  console.log('Connected to MongoDB');
};

startDb()
  .then(() => {})
  .catch(async (err) => {
    console.log(err);
  });
app.use('/', apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
