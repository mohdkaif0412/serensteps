/**
 * Route transitions.
 *
 * A `template` (unlike a `layout`) is re-mounted on every navigation, which is
 * all a cross-fade needs — the animation is one CSS class, so there's no
 * AnimatePresence, no exit choreography to keep in sync, and no JavaScript in
 * the critical path.
 *
 * See `.page-enter` in globals.css: it starts at opacity 0.3 rather than 0 so
 * the page is painted (and LCP-eligible) on the first frame, and its fill mode
 * is `backwards` so no transform lingers afterwards to create a containing
 * block. prefers-reduced-motion collapses it to nothing.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
