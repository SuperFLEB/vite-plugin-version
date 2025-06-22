export type VersionInfo = {
  name: string;
  description?: string;
  version: string;
  semver?: [number, number, number];
  buildTime: number;
};

// This will be replaced with the actual values by the plugin
export default function versionInfo(): VersionInfo {
  return {
    name: "unknown",
    description: "This is the default version plugin output. The Vite version plugin was not run.",
    version: "0.0.0",
    semver: [0, 0, 0],
    buildTime: 946_684_800_000,
  };
}
