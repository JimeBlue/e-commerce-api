import cors from 'cors';
import express from 'express';
import connectDB from './db/index.ts';
import userRoutes from './routes/userRoutes.ts';

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/users', userRoutes);

await connectDB();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
