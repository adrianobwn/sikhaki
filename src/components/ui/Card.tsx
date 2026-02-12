"use client";

import React from "react";

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, icon, action, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-slate-500">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              {title}
            </h3>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
