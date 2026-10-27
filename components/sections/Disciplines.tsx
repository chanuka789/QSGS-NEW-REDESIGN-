import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { disciplines } from "@/lib/site";

/** Ruled list of measured disciplines (no boxes). */
export function Disciplines() {
  return (
    <Stagger className="grid border-t border-ink sm:grid-cols-2" gap={0.05}>
      {disciplines.map((d, i) => (
        <StaggerItem key={d.name} className={`group flex items-center gap-6 border-b border-line py-6 ${i % 2 === 1 ? "sm:pl-10" : "sm:pr-10"}`}>
          <span className="num w-8">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex-1 text-[1.25rem] font-medium tracking-[-0.02em] text-ink transition-transform duration-500 group-hover:translate-x-1">{d.name}</span>
          <Icon name={d.icon} className="h-6 w-6 text-ink/30 transition-colors duration-500 group-hover:text-brand" />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
