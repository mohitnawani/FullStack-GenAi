const { createClient } = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redis = createClient({
    username: 'Mohit',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-12509.c277.us-east-1-3.ec2.cloud.redislabs.com',
        port: 12509
    }
});

module.exports = redis;


