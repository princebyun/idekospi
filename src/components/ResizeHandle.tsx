import React, { useRef, useEffect } from 'react';

interface ResizeHandleProps {
  orientation: 'horizontal' | 'vertical';
  onResize: (newSize: number) => void;
  minSize: number;
  maxSize: number;
}

export function ResizeHandle({ orientation, onResize, minSize, maxSize }: ResizeHandleProps) {
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      if (orientation === 'vertical') {
        // 사이드바 조절 (X축)
        let newWidth = e.clientX - 48; // ActivityBar(48px) 제외한 너비
        if (newWidth < minSize) newWidth = minSize;
        if (newWidth > maxSize) newWidth = maxSize;
        onResize(newWidth);
      } else {
        // 터미널 조절 (Y축)
        // 화면 아래쪽부터의 높이
        let newHeight = window.innerHeight - e.clientY - 24; // StatusBar(24px) 제외
        if (newHeight < minSize) newHeight = minSize;
        if (newHeight > maxSize) newHeight = maxSize;
        onResize(newHeight);
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; // 드래그 시 텍스트 선택 방지 해제
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [orientation, onResize, minSize, maxSize]);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none'; // 드래그 시 텍스트 선택 방지
  };

  if (orientation === 'vertical') {
    return (
      <div 
        onMouseDown={handleMouseDown}
        className="w-[11px] -mx-[5px] z-50 flex justify-center bg-transparent cursor-col-resize group outline-none shrink-0"
      >
        <div className="w-[1px] h-full bg-[#2b2b2b] group-hover:bg-[#007acc] group-active:bg-[#007acc] transition-colors" />
      </div>
    );
  }

  return (
    <div 
      onMouseDown={handleMouseDown}
      className="h-[11px] -my-[5px] z-50 flex flex-col justify-center bg-transparent cursor-row-resize group outline-none shrink-0"
    >
      <div className="h-[1px] w-full bg-[#2b2b2b] group-hover:bg-[#007acc] group-active:bg-[#007acc] transition-colors" />
    </div>
  );
}
