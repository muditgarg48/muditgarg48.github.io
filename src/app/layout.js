import { Montserrat, Pacifico, Roboto_Mono, Passion_One, Archivo, Playwrite_AR } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

const passionOne = Passion_One({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-passion-one",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const playwriteAR = Playwrite_AR({
  variable: "--font-playwrite-ar",
});

const carpenter = localFont({
  src: "../assets/fonts/Carpenter/Carpenter-Regular.woff2",
  variable: "--font-carpenter",
});

export const metadata = {
  title: "Mudit Garg",
  description: "Mudit Garg's Portfolio Website",
};

import { SiteModeProvider } from "../context/SiteModeContext";


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${pacifico.variable} ${robotoMono.variable} ${passionOne.variable} ${archivo.variable} ${carpenter.variable} ${playwriteAR.variable}`}>
      <head>
        <link id="favicon" rel="icon" href="/favicon-recruiter.ico" />
        <link id="apple-touch-icon" rel="apple-touch-icon" href="/logo192-recruiter.png" />
        <meta name="theme-color" content="#00abf0" />
      </head>
      <body>
        <SiteModeProvider>
          {children}
        </SiteModeProvider>
      </body>
    </html>
  );
}