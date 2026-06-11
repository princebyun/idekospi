import React from 'react';

export function TopMenuBar() {
  return (
    <div className="h-[30px] flex items-center px-2 bg-[#3c3c3c] border-b border-[#2b2b2b] text-[#cccccc] text-[13px] select-none flex-shrink-0">
      <div className="flex items-center space-x-1 h-full">
        <div className="h-full flex items-center justify-center px-2 hover:bg-[#505050] cursor-pointer rounded-md mx-1 transition-colors">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" className="w-[18px] h-[18px]" alt="VSCode Icon" />
        </div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">File</div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">Edit</div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">Selection</div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">View</div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">Go</div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">Run</div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">Terminal</div>
        <div className="h-full flex items-center px-2 hover:bg-[#505050] cursor-pointer rounded-md transition-colors">Help</div>
      </div>
      
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <span className="text-[12px] text-[#cccccc] opacity-80">IDEKOSPI - AntiGravity</span>
      </div>

      <div className="flex-1 flex justify-end items-center space-x-2 px-2 h-full">
        {/* Fake Window Controls */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#3c3c3c] hover:bg-[#505050] border border-[#555] flex items-center justify-center cursor-pointer">
            <div className="w-1.5 h-[1px] bg-[#858585]"></div>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#3c3c3c] hover:bg-[#505050] border border-[#555] flex items-center justify-center cursor-pointer">
            <div className="w-1.5 h-1.5 border border-[#858585]"></div>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#3c3c3c] hover:bg-[#e81123] border border-[#555] group flex items-center justify-center cursor-pointer transition-colors">
            <svg width="8" height="8" viewBox="0 0 16 16" className="text-[#858585] group-hover:text-white" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.707L8 8.707z"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
