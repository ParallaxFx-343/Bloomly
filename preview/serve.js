const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const file = path.join(__dirname, 'index.html');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(file, 'utf-8'));
}).listen(PORT, () => console.log(`Preview running on http://localhost:${PORT}`));
