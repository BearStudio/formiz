import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>🐜 Formiz</span>,
  project: {
    link: "https://github.com/bearstudio/formiz",
  },
  chat: {
    link: "https://go.bearstudio.fr/discord",
  },
  docsRepositoryBase: "https://github.com/bearstudio/formiz",
  footer: {
    text: "Coded with ❤️ in Normandy by Ivan Dalmet, Hugo Pérard and BearStudio Team - Logotype by David Endico - Documentation powered by Nextra (v2)",
  },
  primaryHue: { light: 140, dark: 115 },
};

export default config;
