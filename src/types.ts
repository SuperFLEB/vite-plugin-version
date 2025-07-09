export type VersionInfo = {
  name: string;
  description?: string;
  version: string;
  semver?: [number, number, number];
  buildTime: number;
};
