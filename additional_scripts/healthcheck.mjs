import * as http from 'node:http';

const options = {
    host: 'localhost',
    port: process.env.PORT,
    timeout: 1200,
};

console.log(`Checking healthcheck on ${options.host}:${options.port}...`);

const request = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode === 200) process.exit(0);
    else process.exit(1);
});

request.on('error', (error) => {
    console.log(`ERROR: ${error}`);
    process.exit(1);
});

request.end();
