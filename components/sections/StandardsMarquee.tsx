import { Marquee } from "@/components/ui/Marquee";
import { software, standards } from "@/lib/site";

export function StandardsMarquee() {
  const items = [...standards, ...software.slice(0, 4)];
  return (
    <section aria-label="Measurement standards and software we use" className="border-y border-line py-6">
      <Marquee speed={50}>
        {items.map((t) => (
          <span key={t} className="mx-8 inline-flex items-center gap-8 whitespace-nowrap text-[1.35rem] font-medium tracking-[-0.02em] text-ink/70 sm:mx-12 sm:text-[1.6rem]">
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-brand/60" aria-hidden />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
