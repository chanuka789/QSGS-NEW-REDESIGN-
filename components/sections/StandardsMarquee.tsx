import { Marquee } from "@/components/ui/Marquee";
import { software, standards } from "@/lib/site";

export function StandardsMarquee() {
  const items = [...standards, ...software.slice(0, 4)];
  return (
    <section aria-label="Measurement standards and software we use" className="border-y border-line py-5">
      <Marquee speed={50}>
        {items.map((t) => (
          <span key={t} className="t-h4 mx-7 inline-flex items-center gap-7 whitespace-nowrap text-muted sm:mx-10">
            {t}
            <span className="h-1 w-1 rounded-full bg-brand" aria-hidden />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
