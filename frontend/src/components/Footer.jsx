import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-center mt-10 px-4 py-6 text-sm text-slate-600">
      <div className="font-medium text-slate-700 mb-1">
        Mukhyamantri Shram Shakti Yojna (मुख्यमंत्री श्रम शक्ति योजना)
      </div>
      <div className="mb-1">
        Training Application Portal – Government of Bihar
      </div>
      <small className="block">
        &copy; {new Date().getFullYear()} Department of Labour Resources, Bihar. All Rights Reserved.
      </small>
    </footer>
  );
}
