import express from 'express';
import morgan from 'morgan';
import Debug from 'debug';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;
const debug = Debug('dev_ENV');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(morgan('tiny'));

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to QuickCredit' });
});
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route is invalid' });
});

app.listen(PORT, () => debug(`Server running on port ${PORT}`));

export default app;
