const { Client } = require('ssh2');

const conn = new Client();
const commands = `
cd /opt/apps/FDE-jhtour
git fetch origin main
git checkout main || git switch -c main
git reset --hard origin/main
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
