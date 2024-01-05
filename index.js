const http = require("http");
const app = require("./app");
const {closeDatabaseConnection} = require("./config/database");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit();
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});