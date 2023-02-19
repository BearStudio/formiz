import Image from "next/image";
import { DocsThemeConfig } from "nextra-theme-docs";

import logo from "./public/logo.svg";

const config: DocsThemeConfig = {
  logo: <Image src={logo} alt="Formiz logo" width={150} />,
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
  primaryHue: { light: 100, dark: 115 },
  sidebar: {
    toggleButton: true,
  },
};

export default config;
