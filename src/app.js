import express from 'express';
import morgan from 'morgan';
import router from './routes/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to QuickCredit' });
});
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route is invalid' });
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));

export default app;
