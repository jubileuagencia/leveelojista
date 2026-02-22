const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const pubKeyPath = path.join(process.env.HOME || process.env.USERPROFILE, '.ssh', 'id_ed25519.pub');
const pubKey = fs.existsSync(pubKeyPath) ? fs.readFileSync(pubKeyPath, 'utf8').trim() : '';
const PASSWORD = 'Jub1l3u@VPS2026';

const conn = new Client();
const CMD = process.argv[2] || 'setup-key';

conn.on('ready', () => {
  if (CMD === 'setup-key') {
    const cmd = `mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '${pubKey}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && sort -u -o ~/.ssh/authorized_keys ~/.ssh/authorized_keys && echo 'KEY_ADDED_OK'`;
    conn.exec(cmd, (err, stream) => {
      if (err) { console.error('Exec error:', err); conn.end(); return; }
      let output = '';
      stream.on('data', (d) => { output += d.toString(); });
      stream.stderr.on('data', (d) => { process.stderr.write(d); });
      stream.on('close', () => { console.log(output.trim()); conn.end(); });
    });
  } else {
    conn.exec(CMD, (err, stream) => {
      if (err) { console.error('Exec error:', err); conn.end(); return; }
      stream.on('data', (d) => { process.stdout.write(d); });
      stream.stderr.on('data', (d) => { process.stderr.write(d); });
      stream.on('close', () => { conn.end(); });
    });
  }
});

conn.on('error', (err) => { console.error('Connection error:', err.message); process.exit(1); });

conn.connect({
  host: '76.13.233.212',
  port: 22,
  username: 'root',
  password: PASSWORD,
  tryKeyboard: true
});
