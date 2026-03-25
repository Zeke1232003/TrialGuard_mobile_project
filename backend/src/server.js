require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');
const subscriptionRoutes = require('./routes/subscriptions');
const { requireAuth } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || '*';
const corsOrigins = corsOrigin
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (corsOrigins.includes('*')) {
        callback(null, true);
        return;
      }

      if (corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
      if (isLocalhostOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);
app.use(express.json({ limit: '1mb' }));

app.use('/health', healthRoutes);
app.use('/api/subscriptions', requireAuth, subscriptionRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`TrialGuard backend running on http://localhost:${port}`);
});
