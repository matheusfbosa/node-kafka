# Kafka and Microservices

Communication between microservices facilitated by Kafka.

## Summary

`api` microservice sends message containing user certificate data to a topic in Kafka, which is consumed by `certificate` microservice.

Then, `certificate` microservice returns a message identifying the user certificate to another topic in Kafka, which is consumed by `api` microservice.

## Technologies

- Kafka
- NodeJS

## Applications

### api

- Express
- Sucrase
- Nodemon
- KafkaJS

### certificate

- Sucrase
- KafkaJS
