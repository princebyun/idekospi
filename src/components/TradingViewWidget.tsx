import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidgetComponent({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  
  // 국장 판별
  const isKrx = symbol.endsWith('.KS') || symbol.endsWith('.KQ') || symbol.startsWith('KRX:');

  useEffect(() => {
    if (!container.current || isKrx) return;

    // Clear previous widget
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView && container.current) {
        
        let tvSymbol = symbol;
        if (symbol.startsWith('KRW-')) {
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
          container_id: container.current?.id,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, isKrx]);

  if (isKrx) {
    return (
      <div className="w-full h-full bg-ide-bg flex items-center justify-center font-mono text-sm">
        <div className="text-left border border-[#841c1c] bg-[#2d0000] p-6 rounded-md shadow-lg max-w-lg">
          <div className="text-[#f14c4c] font-bold mb-4 flex items-center">
            <span className="mr-2">❌</span> ERROR: MODULE_RESTRICTED_BY_POLICY
          </div>
          <div className="text-ide-text mb-2">
            Symbol: <span className="text-code-string">"{symbol}"</span>
          </div>
          <div className="text-ide-text mb-6 leading-relaxed">
            The requested KRX (Korea Exchange) data visualization module has been blocked by the third-party provider's licensing policy. External embedding is strictly prohibited.
          </div>
          <div className="text-ide-text-muted border-t border-[#841c1c] pt-4 text-xs">
            {'>'} ACTION REQUIRED: Please use the [Code View] in the Explorer to monitor the real-time market data for this symbol instead.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" id={`tv_${symbol.replace(/[^a-zA-Z0-9]/g, '')}`} ref={container} />
  );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
