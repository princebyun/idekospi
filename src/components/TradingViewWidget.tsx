import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidgetComponent({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        
        let tvSymbol = symbol;
        // Transform symbol for TradingView
        if (symbol.endsWith('.KS') || symbol.endsWith('.KQ')) {
          tvSymbol = `KRX:${symbol.replace(/\.K[SQ]/, '')}`;
        } else if (symbol.startsWith('KRW-')) {
          tvSymbol = `UPBIT:${symbol.replace('KRW-', '')}KRW`;
        }

        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Asia/Seoul',
          theme: 'dark',
          style: '1',
          locale: 'kr',
          enable_publishing: false,
          backgroundColor: '#1e1e1e',
          gridColor: '#313131',
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: container.current.id,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-full" id={`tv_${symbol.replace(/[^a-zA-Z0-9]/g, '')}`} ref={container} />
  );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
