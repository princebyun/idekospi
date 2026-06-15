// Helper: KST 시간 계산
function getKST(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (9 * 3600000));
}

// Helper: Get KST Time based Market State for KR
export function getKoreanMarketState(): string {
  const kst = getKST();
  
  const day = kst.getDay();
  if (day === 0 || day === 6) return 'CLOSED';
  
  const hour = kst.getHours();
  const minute = kst.getMinutes();
  const time = hour * 100 + minute;
  
  if (time >= 830 && time < 900) return 'PRE';
  if (time >= 900 && time <= 1530) return 'REGULAR';
  if (time > 1530 && time <= 1800) return 'POST';
  return 'CLOSED';
}

// Helper: Override US Market State for Day Market
export function getUSMarketState(yahooState: string): string {
  const kst = getKST();
  
  const day = kst.getDay();
  if (day >= 1 && day <= 5) {
    const hour = kst.getHours();
    if (hour >= 9 && hour < 17) {
      // 한국 낮 시간(09:00~17:00)에는 야후 상태와 무관하게 무조건 데이마켓으로 오버라이드
      return 'DAY';
    }
  }
  return yahooState;
}
