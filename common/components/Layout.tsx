import React, { ReactNode } from 'react'
import Image from 'next/image'
import { Container } from 'react-bootstrap';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Container fluid>
            <div className="main">
                {children}
            </div>
            <footer className="footer">
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className="logo">
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </Container>
    )
}