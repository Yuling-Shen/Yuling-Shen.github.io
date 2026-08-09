const defaultPlaywrightPort = 4321;
const playwrightPortError =
  "PLAYWRIGHT_PORT must be an integer from 1 through 65535";

export function parsePlaywrightPort(rawPort: string | undefined): number {
  if (rawPort === undefined) {
    return defaultPlaywrightPort;
  }

  if (!/^\d+$/.test(rawPort)) {
    throw new Error(playwrightPortError);
  }

  const port = Number(rawPort);
  if (port < 1 || port > 65535) {
    throw new Error(playwrightPortError);
  }

  return port;
}
