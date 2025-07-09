import versionPlugin from "../src/plugin.js";
import type {ResolvedConfig} from "vite";
import {describe, expect, it, vi} from "vitest";

const PACKAGE_NAME = "@superfleb/vite-plugin-version";

const packageJsons = vi.hoisted(() => ({
  package: {
    "name": "@superfleb/test-module",
    "description": "Test module",
    "version": "1.2.3"
  },
  self: {
    "name": "@superfleb/vite-plugin-version",
    "description": "Mock of this module",
    "version": "3.2.1",
  }
}));

vi.mock("node:fs", () => ({
  readFileSync(reqPath: string) {
    if (/mock-package-dir.package\.json$/.test(reqPath)) return JSON.stringify(packageJsons.package);
    if (/package\.json$/.test(reqPath)) return JSON.stringify(packageJsons.self);
    throw new Error(`Unknown file ${reqPath} requested`);
  }
}));

describe("Version info plugin", () => {
  const plugin = versionPlugin();

  it("Gets the specified package.json in configResolved", () => {
    plugin.configResolved({
      root: "mock-package-dir",
    } as ResolvedConfig);

    const loaded = plugin.load(`\0${PACKAGE_NAME}`) as string;
    const jsonMatch = loaded.match(/^export default function versionInfo\(\) \{ return \{(.+?)}; }$/);
    expect(jsonMatch).not.toBeNull();
    expect(JSON.parse(`{${jsonMatch[1]}}`)).toEqual({
      ...packageJsons.package,
      semver: [1,2,3], // from packageJsons.package.version
      buildTime: expect.any(Number),
    });
  });

  it("Resolves the virtual module ID to the temporary ID", () => {
    expect(plugin.resolveId("@superfleb/vite-plugin-version")).toBe(`\0${PACKAGE_NAME}`);
  });

  it("Does not resolve other module IDs", () => {
    expect(plugin.resolveId("something-else")).toBeUndefined();
  });
});
