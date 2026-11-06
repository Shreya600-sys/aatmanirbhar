import { SITE } from "../config/site";

/**
 * variant="inline"  -> small logo mark + brand name (navbars, sidebar, footer)
 * variant="stacked" -> full logo artwork, centred (login / register / password pages)
 */
const BrandLogo = ({
  variant = "inline",
  nameClassName = "text-base font-bold text-gray-900 tracking-tight leading-tight",
  className = "",
}) => {
  if (variant === "stacked") {
    return (
      <img
        src="/logo.png"
        alt={`${SITE.name} logo`}
        className={`mx-auto h-28 w-auto object-contain ${className}`}
      />
    );
  }

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5">
        <img src="/logo.png" alt={`${SITE.name} logo`} className="h-full w-full object-contain" />
      </span>
      <span className={nameClassName}>{SITE.name}</span>
    </span>
  );
};

export default BrandLogo;
