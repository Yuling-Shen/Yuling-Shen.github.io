export function withBase(
  path: string,
  base: string = import.meta.env.BASE_URL || "/",
): string {
  const cleanBase =
    base === "/" ? "/" : "/" + base.replace(/^\/+|\/+$/g, "") + "/";
  return cleanBase + path.replace(/^\/+/, "");
}
