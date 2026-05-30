import React from "react";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  onClose?: () => void;
}

export default function MenuItem({
  children,
  onClick,
  onClose,
}: Props) {
  return (
    <button
      onClick={() => {
        onClick();
        onClose?.();
      }}
      className="w-full px-4 py-3 text-left hover:bg-slate-100 transition text-sm"
    >
      {children}
    </button>
  );
}