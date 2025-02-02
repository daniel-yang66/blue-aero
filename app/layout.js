import "./globals.css";
import Nav from "./components/navigation";
import Link from "next/link";
import Zulu from "./components/zulu";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-screen p-0 m-0 font-sans bg-neutral-900 relative grid justify-items-center">
        <Nav />
        <Zulu />
        {children}
        <footer className="absolute left-4 top-[97vh] text-neutral-300 font-semibold text-sm">
          {" "}
          &copy;{" "}
          <a
            href="https://www.linkedin.com/in/daniel-yang-a17ab3229/"
            target="_blank"
            rel="noreferrer"
            className="a"
          >
            Daniel Yang
          </a>{" "}
          | Powered by{" "}
          <a
            href="https://info.avwx.rest/"
            target="_blank"
            rel="noreferrer"
            className="a"
          >
            AVWX
          </a>{" "}
          &{" "}
          <a
            href="https://docs.tomorrow.io/reference/welcome"
            target="_blank"
            rel="noreferrer"
            className="a"
          >
            Tomorrow.io
          </a>{" "}
          | <Link href="/credits">Credits</Link>
        </footer>
      </body>
    </html>
  );
}
