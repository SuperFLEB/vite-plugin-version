import type {ResolvedConfig} from "vite";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import type {VersionInfo} from "./index";

const selfPJPath = join(import.meta.dirname, "..", "package.json");
const selfPackageJson = JSON.parse(readFileSync(selfPJPath).toString());
const packageImportName = selfPackageJson.name;

type MinimalPackageJson = {
  name: string;
  description?: string;
  version: string;
};

function getVersionInfo(root: string): VersionInfo {
  const pjPath = join(root, "package.json");
  const pj = JSON.parse(readFileSync(pjPath).toString()) as unknown as MinimalPackageJson;
  const semverMatch = pj.version.match(/(\d+)/g);
  const semver = semverMatch ? semverMatch.slice(0, 3).map(v => Number(v)) as [number, number, number] : undefined;
  return {
    name: pj.name,
    description: pj.description,
    version: pj.version,
    semver,
    buildTime: new Date().getTime(),
  };
}

export default function versionPlugin() {
  const virtualModuleId = packageImportName;
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  let versionInfo: VersionInfo = {} as VersionInfo;

  return {
    name: "Version Plugin",
    enforce: "pre",
    configResolved(config: ResolvedConfig) {
      versionInfo = getVersionInfo(config.root);
    },
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default function versionInfo() { return ${JSON.stringify(versionInfo)}; }`;
      }
    },
  };
}
