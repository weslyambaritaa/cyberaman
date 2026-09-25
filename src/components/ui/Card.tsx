import { type ReactNode } from "react";
import clsx from "clsx";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl border-0 bg-[#18181A] p-6 shadow-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
