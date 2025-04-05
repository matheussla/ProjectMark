import express from 'express';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './logger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 