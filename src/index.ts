import express from 'express';

import { config } from '@config';
import { logger } from '@logger';
import { errorHandler } from '@shared/errors';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/', routes);

app.use(errorHandler);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
