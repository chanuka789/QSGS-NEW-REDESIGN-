import { SegmentPage } from "@/components/sections/SegmentPage";
import { buildMetadata } from "@/lib/seo";
import { segmentByKey } from "@/lib/services";

const segment = segmentByKey("developers");

export const metadata = buildMetadata({
  path: segment.href,
  title: segment.seo.title,
  description: segment.seo.description,
  ogTitle: segment.seo.ogTitle,
  ogLabel: segment.h1,
});

export default function Page() {
  return <SegmentPage segment={segment} />;
}
