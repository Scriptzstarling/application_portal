import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-slate-700 px-4 py-5">
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2 sm:gap-0">
        <div className="flex-1 text-center sm:text-left">
          Copyright © {currentYear} [MSSY].
        </div>
        
        <div className="flex-1 text-center sm:text-right">
          Mukhyamantri Shram Shakti Yojna (मुख्यमंत्री श्रम शक्ति योजना).
        </div>
      </div>
    </footer>
  );
}