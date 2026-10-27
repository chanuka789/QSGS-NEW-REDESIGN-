import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { disciplines } from "@/lib/site";

/** Two-column list of measured disciplines. */
export function Disciplines() {
  return (
    <Stagger className="grid gap-x-8 sm:grid-cols-2" gap={0.04}>
      {disciplines.map((d) => (
        <StaggerItem key={d.name} className="group flex items-center gap-4 border-b border-line py-4">
          <span className="glass-icon h-10 w-10 shrink-0">
            <Icon name={d.icon} className="h-5 w-5" />
          </span>
          <span className="t-h4 flex-1 text-ink">{d.name}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
