/* eslint-disable no-console */
const { createServer, DEFAULT_PORT } = require('./createServer');

const server = createServer();

server.listen(DEFAULT_PORT || 5700);
