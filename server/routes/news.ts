import { Router } from 'express';

const router = Router();

router.get('/api/news', async (req, res) => {
  try {
    const response = await fetch('https://m.stock.naver.com/api/news/list?category=mainnews&pageSize=20');
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;
