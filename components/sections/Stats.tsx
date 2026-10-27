import { Counter } from "@/components/ui/Counter";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const stats = [
  { n: 20, s: "+", label: "Countries served", note: "Australia, NZ, UK, USA, Canada, Singapore, Europe & the Middle East" },
  { n: 12, s: "", label: "Project types", note: "From residential and hotels to expressways and infrastructure" },
  { n: 8, s: "", label: "Measurement standards", note: "NRM 01/02, SMM 7, QSMM, POMI, CESMM 3/4, SLS 573" },
  { n: 4, s: "", label: "Office contacts", note: "UAE · Kuwait · Australia · Sri Lanka" },
];

export function Stats({ invert = false }: { invert?: boolean }) {
  return (
    <Stagger className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4" gap={0.06}>
      {stats.map((s) => (
        <StaggerItem key={s.label} className={cn("border-t pt-6", invert ? "border-white/25" : "border-line")}>
          <p className={cn("t-stat", invert ? "text-white" : "text-brand")}>
            <Counter to={s.n} suffix={s.s} />
          </p>
          <p className={cn("t-h4 mt-4", invert ? "text-white" : "text-ink")}>{s.label}</p>
          <p className={cn("t-xs mt-1.5", invert ? "text-white/70" : "text-muted")}>{s.note}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
