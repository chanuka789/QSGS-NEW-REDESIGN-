import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { routes } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center px-5 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-[1320px]">
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-6 text-[clamp(3rem,8vw,7rem)]">This page is off the drawing.</h1>
        <p className="lead mt-6 max-w-xl">The page you are looking for has moved or no longer exists.</p>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <Link href="/" className="btn btn-primary btn-lg w-full justify-between sm:w-auto">
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
