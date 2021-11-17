import express from 'express';
import { Kafka } from 'kafkajs';

import routes from './routes';

const app = express();

/**
 * Connect to Kafka
 */
const kafka = new Kafka({
  clientId: 'api',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'certificate-issued-group' });

/**
 * Producer is available to routes
 */
app.use((req, res, next) => {
  req.producer = producer;
  return next();
});

app.use(routes);

async function run(port) {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: 'certificate-issued' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`received: ${message.value}`);
    },
  });

  app.listen(port, () => {
    console.log(`server ready on ${port} 🚀`);
  });  
}

const port = process.env.PORT || 3000;
run(port).catch(console.error);
