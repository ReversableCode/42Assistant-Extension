import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UiProvider } from "../contexts/ui.context";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UiProvider>
      <Component {...pageProps} />
    </UiProvider>
  );
}
