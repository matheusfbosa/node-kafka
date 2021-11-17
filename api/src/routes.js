import express from 'express';
import { CompressionTypes } from 'kafkajs'; 

const routes = express.Router();

routes.post('/certifications', async (req, res) => {
  const message = {
    user: { id: 1, name: 'Matheus Bosa' },
    course: 'Kafka with NodeJS',
    grade: 5,
  };
  
  await req.producer.send({
    topic: 'issue-certificate',
    compression: CompressionTypes.GZIP,
    messages: [
      { key: 'certificate', value: JSON.stringify(message) },
    ],
  });

  return res.json({ message: 'Message sent' });
});

export default routes;
