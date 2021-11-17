import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'certificate',
  brokers: ['localhost:9092'],
});

const topicName = 'issue-certificate';
const consumer = kafka.consumer({ groupId: 'certificate-group' });

const producer = kafka.producer();

let counter = 0;

async function run() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topicName });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}#${message.value}`);

      const payload = JSON.parse(message.value);

      setTimeout(async () => {
        counter++;
        await producer.send({
          topic: 'certificate-issued',
          messages: [
            { key: 'certificate', value: `#${counter} certificate issued: ${payload.user.name} (${payload.course})` }
          ],
        });
      }, 3000);
    },
  });
}

run().catch(console.error);
