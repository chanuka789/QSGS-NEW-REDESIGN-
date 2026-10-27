import { Counter } from "@/components/ui/Counter";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

const stats = [
  { n: 20, s: "+", label: "Countries served", note: "Australia, NZ, UK, USA, Canada, Singapore, Europe & the Middle East" },
  { n: 12, s: "", label: "Project types", note: "From residential and hotels to expressways and infrastructure" },
  { n: 8, s: "", label: "Measurement standards", note: "NRM 01/02, SMM 7, QSMM, POMI, CESMM 3/4, SLS 573" },
  { n: 4, s: "", label: "Office contacts", note: "UAE · Kuwait · Australia · Sri Lanka" },
];

export function Stats({ dark = false }: { dark?: boolean }) {
  return (
    <Stagger className="grid grid-cols-2 lg:grid-cols-4" gap={0.08}>
      {stats.map((s, i) => (
        <StaggerItem key={s.label} className={`border-t py-8 pr-6 ${dark ? "border-white/15" : "border-line"} ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-6 lg:pl-8" : ""}`}>
          <p className={`text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.03em] ${dark ? "text-paper" : "text-ink"}`}>
            <Counter to={s.n} suffix={s.s} />
          </p>
          <p className={`mt-4 text-[1rem] font-medium ${dark ? "text-paper" : "text-ink"}`}>{s.label}</p>
          <p className={`mt-1.5 text-[0.88rem] leading-snug ${dark ? "text-white/55" : "text-muted"}`}>{s.note}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
