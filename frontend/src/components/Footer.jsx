import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 border-t px-4 py-5"
      style={{ borderColor: "#372948" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2 sm:gap-0 text-[#372948]">
        <div className="flex-1 text-center sm:text-left">
          Copyright © {currentYear} [MSSY].
        </div>

        <div className="flex-1 text-center sm:text-right">
          Designed and Developed by{" "}
          <a
            href="https://codebuckets.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "#372948" }}
          >
            Codebucket Solutions Pvt Ltd
          </a>
        </div>
      </div>
    </footer>
  );
}
