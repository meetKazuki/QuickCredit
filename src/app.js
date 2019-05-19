import express from 'express';
import morgan from 'morgan';
import debug from 'debug';
import '@babel/polyfill';

import authRouter from './routes/auth';
// import apiRouter from './routes/api';

const app = express();
const Debug = debug('dev_ENV');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/api/v1/auth', authRouter);
// app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to QuickCredit' });
});
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route is invalid' });
});

app.listen(PORT, () => Debug(`Server running on port ${PORT}`));

export default app;
