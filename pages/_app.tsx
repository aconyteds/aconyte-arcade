import "../styles/globals.scss";
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ToasterContextProvider } from "../common/contexts/toaster";
import { Navbar, Nav, Container } from 'react-bootstrap';
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="app">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Arcade</Navbar.Brand>
          <Nav className="me-auto">
            <Link href="/games/sudoku" passHref>
              <Nav.Link>Sudoku</Nav.Link>
            </Link>
            <Link href="/games/wordGame" passHref>
              <Nav.Link>Word Game</Nav.Link>
            </Link>
          </Nav>
        </Container>
      </Navbar>
      <ToasterContextProvider>
        <Component {...pageProps} />
      </ToasterContextProvider>
    </div>
  </>
}

export default MyApp
