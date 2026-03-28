"use client";

import { usePathname } from "next/navigation";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The key forces React to fully unmount + remount children on every navigation,
  // which ensures Framer Motion's `animate` and `whileInView` directives retrigger.
  return <div key={pathname}>{children}</div>;
}
