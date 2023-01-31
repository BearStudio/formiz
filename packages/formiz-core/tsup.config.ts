import type { Options } from "tsup";

export const tsup: Options = {
  splitting: true,
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  format: ["cjs", "esm"], // generate cjs and esm files
  bundle: true,
  skipNodeModulesBundle: false,
  entryPoints: ["src/index.ts"],
  target: "es2020",
  external: ["react"],
  outDir: "dist",
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/tests/**/*"], //include all files under src
};
