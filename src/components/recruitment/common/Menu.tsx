import React, {
  useState,
} from "react";

interface Props {
  button: React.ReactNode;
  children: React.ReactNode;
}

export default function Menu({
  button,
  children,
}: Props) {

  const [open, setOpen] =
    useState(false);

  return (
    <div className="relative">

      <div
        onClick={() =>
          setOpen(!open)
        }
        className="cursor-pointer"
      >
        {button}
      </div>

      {open && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() =>
              setOpen(false)
            }
          />

          <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-200 min-w-[220px] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {React.Children.map(
              children,
              (child) =>
                React.isValidElement(
                  child
                )
                  ? React.cloneElement(
                      child as React.ReactElement<any>,
                      {
                        onClose:
                          () =>
                            setOpen(
                              false
                            ),
                      }
                    )
                  : child
            )}
          </div>
        </>
      )}
    </div>
  );
}