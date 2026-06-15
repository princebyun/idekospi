import { DOMESTIC_LIST } from '../services/marketData';

/**
 * API 시장 상태 코드를 한글 상태 텍스트로 변환
 */
export function getMarketStatusText(title: string, code: string, apiMarketState?: string): string {
  if (title.includes('코인') || code.startsWith('KRW-')) {
    return "'24시간 거래 중입니다.'";
  }

  if (apiMarketState) {
    if (apiMarketState === 'PRE' || apiMarketState === 'PREPRE') return "'현재 프리마켓 진행 중입니다.'";
    if (apiMarketState === 'REGULAR') return "'현재 정규장이 열려있습니다.'";
    if (apiMarketState === 'POST' || apiMarketState === 'POSTPOST') return "'현재 애프터마켓 진행 중입니다.'";
    if (apiMarketState === 'DAY') return "'데이마켓 (무료 API 공식 실시간 시세 미지원)'";
    if (apiMarketState === 'CLOSED') return "'시장이 마감되었습니다.'";
  }

  // fallback
  const isDomestic = title.includes('국장') || DOMESTIC_LIST.some(i => i.code === code) || code.endsWith('.KS') || code.endsWith('.KQ');
  if (isDomestic) return "'장 상태 모니터링 중...'";

  return "'장 상태 모니터링 중...'";
}

/**
 * 시장 상태에 따른 태그 문자열 생성
 */
export function getMarketTag(marketState?: string): string {
  if (marketState === 'PRE' || marketState === 'PREPRE') return '[PRE] ';
  if (marketState === 'POST' || marketState === 'POSTPOST' || marketState === 'CLOSED') return '[AFT] ';
  if (marketState === 'DAY') return '[DAY] ';
  return '';
}

/**
 * 가격 문자열 포맷팅
 */
export function formatPriceString(
  price: number,
  options: {
    isDomestic: boolean;
    isCrypto: boolean;
    isIndex: boolean;
    exchangeRate: number;
  }
): { priceStr: string; isString: boolean } {
  const { isDomestic, isCrypto, isIndex, exchangeRate } = options;

  if (isIndex) {
    return {
      priceStr: price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      isString: false
    };
  }

  if (isDomestic || isCrypto) {
    const krwStr = `₩${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    const usdPrice = price / exchangeRate;
    return {
      priceStr: `'${krwStr} ($${usdPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })})'`,
      isString: true
    };
  }

  // 해외 주식
  const usdStr = `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const krwPrice = price * exchangeRate;
  return {
    priceStr: `'${usdStr} (₩${krwPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })})'`,
    isString: true
  };
}
