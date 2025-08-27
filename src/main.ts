import express from 'express';
import cors from 'cors';
import { PORT } from './config/config';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', transactionRoutes);

app.get('/health', (req, res) => { res.status(200).json({ status: 'ok', uptime: process.uptime() }); });


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
