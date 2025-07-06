# @superfleb/vite-plugin-version

A plugin to import version information.

## To use

Install the `@superfleb/vite-plugin-version` module, and add @superfleb/vite-plugin-version/plugin as a plugin to your
`vite.config.js`. Be sure to use the `/plugin` path in the Vite config.

```javascript
import { defineConfig } from "vite";
import version from "@superfleb/vite-plugin-version/plugin";

export default defineConfig({
  plugins: [version(), /* ... */],
  // ...
})
```

Now, in your code, importing `@superfleb/vite-plugin-version` will import a version-information object, generated on
each build.

```javascript
import versionInfo from "@superfleb/vite-plugin-version";

const version = versionInfo();
console.log("Package name ............. ", version.name);
console.log("Package description ...... ", version.description);
console.log("Version .................. ", version.version);
console.log("Version (Semver Array) ... ", version.semver);
console.log("Build time ............... ", new Date(version.buildTime));
```
