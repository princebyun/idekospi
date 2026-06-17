import fs from 'fs';
import path from 'path';

// If running from dist/server/utils, ../../logs goes to root/logs
// If running from server/utils (ts-node), ../../logs goes to root/logs
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

export const logger = {
  error: (msg: string, err?: any) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ERROR: ${msg} ${err ? err.stack || err : ''}\n`;
    console.error(log);
    fs.appendFileSync(path.join(logDir, 'error.log'), log);
  },
  info: (msg: string) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] INFO: ${msg}\n`;
    console.log(log);
    fs.appendFileSync(path.join(logDir, 'server.log'), log);
  }
};
