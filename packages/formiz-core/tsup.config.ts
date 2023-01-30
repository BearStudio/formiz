import { defineConfig } from "tsup";

const externalCjsToEsmPlugin = (external: any) => ({
  name: "external",
  setup(build: any) {
    let escape = (text: any) =>
      `^${text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}$`;
    let filter = new RegExp(external.map(escape).join("|"));
    build.onResolve({ filter: /.*/, namespace: "external" }, (args: any) => ({
      path: args.path,
      external: true,
    }));
    build.onResolve({ filter }, (args: any) => ({
      path: args.path,
      namespace: "external",
    }));
    build.onLoad({ filter: /.*/, namespace: "external" }, (args: any) => ({
      contents: `export * from ${JSON.stringify(args.path)}`,
    }));
  },
});

export default defineConfig({
  esbuildPlugins: [externalCjsToEsmPlugin(["zustand"])],
});
