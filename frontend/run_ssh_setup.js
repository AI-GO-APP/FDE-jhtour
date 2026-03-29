const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

const STAGING_HOST = '35.229.224.149';
const STAGING_USER = 'deploy';
const STAGING_PASS = 'Staging@2026!';

const commands = `
echo "=== Step 1: Generate SSH Keys ==="
ssh-keygen -t ed25519 -f ~/.ssh/jhtour-deploy-key -N "" -q

echo "=== Step 2: Configure SSH Host ==="
cat << 'EOF' >> ~/.ssh/config
Host github.com-FDE-jhtour
  HostName github.com
  IdentityFile ~/.ssh/jhtour-deploy-key
  StrictHostKeyChecking no
  IdentitiesOnly yes
EOF

echo "=== Step 3: Fetch the generated Public Key ==="
echo "---PUBKEY_START---"
cat ~/.ssh/jhtour-deploy-key.pub
echo "---PUBKEY_END---"

echo "=== Step 4: Fetch the generated Private Key ==="
echo "---PRIVKEY_START---"
cat ~/.ssh/jhtour-deploy-key
echo "---PRIVKEY_END---"

echo "=== Step 5: Setup Opt Apps Dir ==="
echo "${STAGING_PASS}" | sudo -S mkdir -p /opt/apps/FDE-jhtour
echo "${STAGING_PASS}" | sudo -S chown -R deploy:deploy /opt/apps/FDE-jhtour

echo "=== Step 6: Clone Git ==="
cd /opt/apps/FDE-jhtour
# Git clone might fail if deploy key is not added to github yet.
# We will just init it locally and set remote to ease the setup!
git init
git remote add origin git@github.com-FDE-jhtour:makarove-urfit/FDE-jhtour.git
# We can't fetch until user adds the key to Github. That's fine, Github Action will do fetch!

echo "=== Step 7: Create .env ==="
cat << 'EOF' > /opt/apps/FDE-jhtour/.env
AIGO_API_BASE_URL=https://ai-go.app/api/v1
AIGO_ERP_API_KEY=sk_live_0f9d37c8c8504ab73f15fa9f56494a35607b5f55d5e213f66b790f917d00f4c0
AIGO_ERP_APP_ID=0896b6c79114
SESSION_SECRET=jhtour-erp-session-secret-2026-change-me
EOF

echo "=== Step 8: Configure Nginx ==="
echo "${STAGING_PASS}" | sudo -S bash -c "cat << 'EOF' > /etc/nginx/sites-available/jhtour
server {
    listen 80;
    server_name jhtour.staging.ai-go.app; 

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
    }
}
EOF"

echo "${STAGING_PASS}" | sudo -S rm -f /etc/nginx/sites-enabled/jhtour
echo "${STAGING_PASS}" | sudo -S ln -s /etc/nginx/sites-available/jhtour /etc/nginx/sites-enabled/
echo "${STAGING_PASS}" | sudo -S systemctl reload nginx

echo "=== Step 9: Configure SSL with Certbot ==="
echo "${STAGING_PASS}" | sudo -S certbot --nginx -d jhtour.staging.ai-go.app --non-interactive --agree-tos --register-unsafely-without-email

echo "ALL_DONE"
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      fs.writeFileSync('deploy-output.log', out, 'utf8');
      
      const pubMatch = out.match(/---PUBKEY_START---([\s\S]*?)---PUBKEY_END---/);
      const privMatch = out.match(/---PRIVKEY_START---([\s\S]*?)---PRIVKEY_END---/);
      
      console.log('\\n\\n=== EXPORTED PUBLIC KEY (ADD TO GITHUB DEPLOY KEYS) ===\\n');
      console.log(pubMatch ? pubMatch[1].trim() : 'NOT FOUND');
      
      console.log('\\n\\n=== EXPORTED PRIVATE KEY (ADD TO GITHUB SECRETS) ===\\n');
      console.log(privMatch ? privMatch[1].trim() : 'NOT FOUND');

      conn.end();
    }).on('data', (data) => {
      out += data.toString();
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      out += data.toString();
      process.stderr.write(data);
    });
  });
}).connect({
  host: STAGING_HOST,
  port: 22,
  username: STAGING_USER,
  password: STAGING_PASS,
  readyTimeout: 99999
});
