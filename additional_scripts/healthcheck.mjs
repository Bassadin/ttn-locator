import * as http from 'node:http';

const options = {
    host: 'ttnmapper-reader',
    path: '/',
    port: process.env.PORT,
    timeout: 2000,
};

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
