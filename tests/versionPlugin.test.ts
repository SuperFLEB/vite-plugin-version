import versionPlugin from "../src/plugin.js";
import {join} from "node:path";
import type {ResolvedConfig} from "vite";
import {describe, expect, it} from "vitest";

const __dirname = import.meta.dirname;
const versionInfo = {
  "name": "@superfleb/test-module",
  "description": "Test module",
  "version": "1.2.3",
  "semver": [1, 2, 3],
};

describe("Version info plugin", () => {
  const plugin = versionPlugin();

  it("Gets the specified package.json in configResolved", () => {
    plugin.configResolved({
      root: join(__dirname, "mock"),
    } as ResolvedConfig);

    const loaded = plugin.load("\0@superfleb/vite-plugin-versioninfo") as string;
    const jsonMatch = loaded.match(/^export default function versionInfo\(\) \{ return \{(.+?)}; }$/);
    expect(jsonMatch).not.toBeNull();
    expect(JSON.parse(`{${jsonMatch[1]}}`)).toEqual({
      ...versionInfo,
      buildTime: expect.any(Number),
    });
  });

  it("Resolves the virtual module ID to the temporary ID", () => {
    expect(plugin.resolveId("@superfleb/vite-plugin-versioninfo")).toBe("\0@superfleb/vite-plugin-versioninfo");
  });

  it("Does not resolve other module IDs", () => {
    expect(plugin.resolveId("something-else")).toBeUndefined();
  });
});
