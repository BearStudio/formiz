import Image from "next/image";
import { useRouter } from "next/router";
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
  primaryHue: { light: 130, dark: 115 },
  sidebar: {
    toggleButton: true,
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Formiz" />
      <meta
        property="og:description"
        content="React forms with ease! Composable, headless & with built-in multi steps"
      />
    </>
  ),
  useNextSeoProps: () => {
    const { route } = useRouter();
    const titleTemplate = route === "/" ? "Formiz" : "%s - Formiz";
    return {
      titleTemplate,
    };
  },
  banner: {
    key: "v2",
    dismissible: false,
    text: (
      <a href="https://v1.formiz-react.com" target="_blank">
        🐜 This is Formiz v2 documentation. See v1 documentation →
      </a>
    ),
  },
};

export default config;
