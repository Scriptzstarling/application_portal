import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-slate-700 px-4 py-3">
      <div className="flex justify-between items-center text-sm">
        <div className="flex-1">
          Copyright © {currentYear} [MSSY].
        </div>
        
        <div className="flex-1 text-center">
          Website Admin
        </div>
        
        <div className="flex-1 text-right">
          Mukhyamantri Shram Shakti Yojna (मुख्यमंत्री श्रम शक्ति योजना).
        </div>
      </div>
    </footer>
  );
}