import { Router } from 'express';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const router = Router();

// Git 실제 로그를 가져오는 엔드포인트
router.get('/api/git/log', async (req, res) => {
  try {
    const { stdout } = await execPromise('git log -n 50 --pretty=format:"%s"');
    const logs = stdout.split('\n').filter(line => line.trim().length > 0);
    res.json({ logs });
  } catch (error) {
    console.error('Failed to get git log', error);
    res.status(500).json({ error: 'Failed to get git log', logs: [] });
  }
});

// ReleaseNotes 렌더링용 Git 로그 (해시, 날짜 포함)
router.get('/api/git/releases', async (req, res) => {
  try {
    const { stdout } = await execPromise('git log -n 20 --pretty=format:"%h|%cd|%s" --date=short');
    const releases = stdout.split('\n').filter(line => line.trim().length > 0).map(line => {
      const [hash, date, ...msgParts] = line.split('|');
      return {
        hash,
        date,
        message: msgParts.join('|').replace(/"/g, "'") // 따옴표 이스케이프 방지
      };
    });
    res.json({ releases });
  } catch (error) {
    console.error('Failed to get git releases', error);
    res.status(500).json({ error: 'Failed to get git releases', releases: [] });
  }
});

export default router;
