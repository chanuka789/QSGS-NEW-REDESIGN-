import { LandingPage } from "@/components/sections/LandingPage";
import { landingByKey } from "@/lib/landing";
import { buildMetadata } from "@/lib/seo";

const page = landingByKey("qatar");

export const metadata = buildMetadata({
  path: page.path,
  title: page.seo.title,
  description: page.seo.description,
  ogLabel: page.seo.ogLabel,
});

export default function Page() {
  return <LandingPage page={page} />;
}
