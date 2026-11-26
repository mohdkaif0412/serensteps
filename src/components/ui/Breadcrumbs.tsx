import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/**
 * The visible breadcrumb trail and its BreadcrumbList markup, from one `trail`.
 *
 * They are one component on purpose. Google requires structured data to match
 * what the page shows, and two separate lists drift apart the first time a page
 * is renamed — so there is nowhere to write the trail twice. Pass only the
 * page's own path; "Home" is prepended for both.
 *
 *   <Breadcrumbs trail={[{ name: "Services", path: "/services" }, { name: "Individual counselling", path: "/services/individuals" }]} />
 *
 * The last crumb is the current page: plain text with `aria-current`, not a
 * link to itself.
 */
export function Breadcrumbs({
  trail,
  className,
}: {
  trail: Crumb[];
  className?: string;
}) {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, ...trail];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb" className={cn("text-sm text-muted", className)}>
        {/* One line, always: the ancestors keep their width and the current page
            (the one that can be a whole article title) takes what's left and
            truncates. Wrapping stranded a lone chevron at the start of line two. */}
        <ol className="flex flex-nowrap items-center gap-1.5">
          {crumbs.map((crumb, index) => {
            const current = index === crumbs.length - 1;
            return (
              <li
                key={crumb.path}
                className={cn("flex items-center gap-1.5", current ? "min-w-0" : "shrink-0")}
              >
                {index > 0 && (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-hint"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
                {current ? (
                  <span aria-current="page" className="truncate font-medium text-forest">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="inline-block py-1 underline-offset-4 transition-colors hover:text-forest hover:underline"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
