"use client";

import { useEffect, useState } from "react";

/** Live local time for an office (helps visitors pick a meeting time). */
export function LocalTime({ tz }: { tz: string }) {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [tz]);
  return (
    <span className="text-[0.82rem] tabular-nums text-muted" aria-label={t ? `Local time ${t}` : undefined}>
      {t ? `${t} local` : " "}
    </span>
  );
}
