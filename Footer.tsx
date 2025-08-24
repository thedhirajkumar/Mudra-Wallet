import React from "react";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t w-full border-black/30 py-5 flex justify-between items-center text-gray-500 text-sm mt-auto px-4">
      <p>
        Made by <span className="font-medium text-gray-900">Navdeep</span>
      </p>
      <div className="flex gap-4">
        <Link
          href="https://github.com/navdeep1840"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-gray-900 transition-colors"
        >
          <Github className="w-5 h-5 text-black" />
        </Link>
        <Link
          href="https://twitter.com/navdeep1840"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="hover:text-gray-900 transition-colors"
        >
          <Twitter className="w-5 h-5 text-black" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
