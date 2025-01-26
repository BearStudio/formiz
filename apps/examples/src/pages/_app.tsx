import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { FormizDevTools, FormizProvider } from "@formiz/core";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Formiz Examples</title>
      </Head>
      <ChakraProvider>
        <FormizProvider>
          <Component {...pageProps} />
          <FormizDevTools />
        </FormizProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
