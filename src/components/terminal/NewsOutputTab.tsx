import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';

export function NewsOutputTab() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.items) {
            setNews(data.items);
          } else if (Array.isArray(data)) {
            setNews(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch news', err);
      }
    };
    fetchNews();
    const newsIntervalId = setInterval(fetchNews, 60000);
    return () => clearInterval(newsIntervalId);
  }, []);

  return (
    <div className="p-4 flex-1 font-mono text-[13px] leading-relaxed">
      <div className="text-[#4fc1ff] mb-4">Starting IDE-KOSPI Output Stream... [OK]</div>
      {news.map((item, idx) => (
        <div key={idx} className="mb-2 hover:bg-[#2a2d2e] px-2 py-1 rounded flex">
          <span className="text-[#569cd6] w-16 shrink-0">[INFO]</span>
          <span className="text-ide-text-muted w-24 shrink-0">
            {item.dt ? `${item.dt.substring(4, 6)}-${item.dt.substring(6, 8)} ${item.dt.substring(8, 10)}:${item.dt.substring(10, 12)}` : ''}
          </span>
          <a href={`https://m.stock.naver.com/investment/news/article/${item.oid}/${item.aid}`} target="_blank" rel="noreferrer" className="text-[#ce9178] hover:underline flex-1 truncate">
            {item.tit}
          </a>
          <span className="text-ide-text-muted ml-2 shrink-0 w-24 text-right truncate">{item.ohnm}</span>
        </div>
      ))}
      {news.length === 0 && (
        <div className="text-ide-text-muted animate-pulse">Fetching news stream...</div>
      )}
    </div>
  );
}
