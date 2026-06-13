import React from 'react';
import { FaGoogle, FaInstagram, FaGithub } from "react-icons/fa";
import { TbMail } from "react-icons/tb";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background text-white pt-24 pb-16 px-6 md:px-12 lg:px-32 border-t border-white/10 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col justify-start items-start text-left">

        <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-slate-100 mb-8">
          Contact
        </h2>

        <p className="text-sm md:text-base text-slate-400 font-light max-w-xl leading-relaxed tracking-wide mb-6">
          I'm currently looking to join a cross-functional team that values building high-performance architectures, scalable data schemas, and clean SaaS workflows. Or have a project in mind? Let's connect.
        </p>

        <a
          href="mailto:info@taskflow.com"
          className="group flex items-center gap-2 text-sm md:text-base text-slate-200 hover:text-primary font-normal tracking-wide transition-colors duration-300 mb-10"
        >
          <TbMail className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
          <span>info@taskflow.com</span>
        </a>

        <div className="flex items-center gap-6 text-slate-400 mb-12">
          <a
            href="#instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
            aria-label="Instagram Profile"
          >
            <FaInstagram className="w-5 h-5 stroke-[1.5]" />
          </a>

          <a
            href="#portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
            aria-label="Dribbble Portfolio"
          >
            <FaGoogle className="w-5 h-5 stroke-[1.5]" />
          </a>

          <a
            href="#github"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
            aria-label="GitHub Profile"
          >
            <FaGithub className="w-5 h-5 stroke-[1.5]" />
          </a>
        </div>

        <div className="w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] font-mono text-slate-600 tracking-wider">
          <span>&copy; {currentYear} TASKFLOW. ALL RIGHTS RESERVED.</span>
          <span className="text-primary/40">FASTAPI // REACT // ELECTRON</span>
        </div>

      </div>
    </footer>
  );
}
