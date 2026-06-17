import { AlertCircle } from 'lucide-react';

export function FakeStatusBar() {
  return (
    <div className="h-6 flex items-center px-3 bg-[#007acc] text-white text-[12px] justify-between select-none shrink-0">
      <div className="flex items-center space-x-4">
        <span className="flex items-center hover:bg-white/20 px-2 cursor-pointer h-full">
          main*
        </span>
        <span className="flex items-center hover:bg-white/20 px-2 cursor-pointer h-full">
          <AlertCircle size={13} className="mr-1" />
          0, 0
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="hover:bg-white/20 px-2 cursor-pointer h-full flex items-center">UTF-8</span>
        <span className="hover:bg-white/20 px-2 cursor-pointer h-full flex items-center">Java</span>
        <span className="hover:bg-white/20 px-2 cursor-pointer h-full flex items-center">Spring Boot</span>
      </div>
    </div>
  );
}
