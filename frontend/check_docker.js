const { Client } = require('ssh2');

const conn = new Client();
const commands = `
echo "=== Check docker-compose ==="
docker-compose --version || echo "No docker-compose"
`;

conn.on('ready', () => {
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).connect({
  host: '35.229.224.149',
  port: 22,
  username: 'deploy',
  password: 'Staging@2026!',
  readyTimeout: 99999
});
