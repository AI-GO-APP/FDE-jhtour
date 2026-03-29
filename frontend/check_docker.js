const { Client } = require('ssh2');

const conn = new Client();
const commands = `
echo "=== Manual Deploy ==="
cd /opt/apps/FDE-jhtour
git fetch origin main || echo "Git fetch failed"
git reset --hard FETCH_HEAD || echo "Git reset failed"
ls -la
docker-compose -f docker-compose.staging.yml up -d --build
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
