import '@babel/polyfill';
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import debug from 'debug';
import router from './routes';

const app = express();
const Debug = debug('http');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(morgan(':method :url :status :response-time ms'));

app.use(cors());
app.options('*', cors());

app.use('/api/v1/', router);

app.get('/', (req, res) => {
  res.status(301).redirect('/docs');
});

app.get('/docs', (req, res) => {
  res.status(200).sendFile(path.resolve('./server/docs/quickcredit-docs.html'));
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route is Invalid' });
});

app.listen(PORT, () => Debug(`Server running on port ${PORT}`));

export default app;
