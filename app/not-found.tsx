import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { routes } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[75svh] items-center pt-28">
      <div className="container-x">
        <p className="eyebrow">Error 404</p>
        <h1 className="t-display mt-4">This page is off the drawing.</h1>
        <p className="t-lead mt-5 max-w-xl">The page you are looking for has moved or no longer exists.</p>
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/" className="btn btn-primary w-full justify-between sm:w-auto">
            Back to home <ArrowUpRight className="h-5 w-5" />
          </Link>
          <Link href={routes.services} className="link-arrow">
            Explore our services <ArrowLong />
          </Link>
        </div>
      </div>
    </section>
  );
}
