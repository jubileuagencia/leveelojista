const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(process.env.HOME || process.env.USERPROFILE, '.ssh', 'id_ed25519');
const CMD = process.argv.slice(2).join(' ') || 'hostname';

const conn = new Client();

conn.on('ready', () => {
  conn.exec(CMD, (err, stream) => {
    if (err) { console.error('Exec error:', err.message); conn.end(); return; }
    let stdout = '';
    let stderr = '';
    stream.on('data', (d) => { stdout += d.toString(); });
    stream.stderr.on('data', (d) => { stderr += d.toString(); });
    stream.on('close', (code) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      conn.end();
      process.exit(code || 0);
    });
  });
});

conn.on('error', (err) => { console.error('SSH error:', err.message); process.exit(1); });

conn.connect({
  host: '76.13.233.212',
  port: 22,
  username: 'root',
  privateKey: fs.readFileSync(keyPath)
});
