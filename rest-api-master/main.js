const server = require('./src/server');

// The port to listen on
const PORT = 3000;
const DB = "./data/development.db.json";

// Launch the server
server.start(PORT, DB);
