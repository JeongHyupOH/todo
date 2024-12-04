import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Todo List",
  description: "A simple todo list application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@2.0/nanumsquare.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/HS-Regular.woff2"
          type="text/css"
        />
      </head>
      <body>
        <Header />
        <Container>{children}</Container>
      </body>
    </html>
  );
}
