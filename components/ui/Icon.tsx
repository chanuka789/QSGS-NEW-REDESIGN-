import {
  Award, Building, Building2, Cable, Droplets, FileSpreadsheet, FileStack, GitCompareArrows, Globe2, Handshake,
  HardHat, Layers, MessageSquareText, PencilRuler, PiggyBank, Route, Ruler, Scale, ScanSearch, SearchCheck, Server,
  ShieldCheck, SlidersHorizontal, Timer, Trees, Zap, GraduationCap, Briefcase, Lightbulb, Target, Users, Sparkles,
  type LucideIcon, type LucideProps,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Award, Building, Building2, Cable, Droplets, FileSpreadsheet, FileStack, GitCompareArrows, Globe2, Handshake,
  HardHat, Layers, MessageSquareText, PencilRuler, PiggyBank, Route, Ruler, Scale, ScanSearch, SearchCheck, Server,
  ShieldCheck, SlidersHorizontal, Timer, Trees, Zap, GraduationCap, Briefcase, Lightbulb, Target, Users, Sparkles,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = icons[name] ?? Sparkles;
  return <C aria-hidden strokeWidth={1.75} {...props} />;
}
