const http = require('http');
const os = require('os');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Hello from Host: ${os.hostname()}! v1\n`);
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});