import '../styles/globals.css'
import Head from 'next/head'
import { UserProvider } from '@auth0/nextjs-auth0'

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Head>
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
                <link rel="stylesheet" href="https://use.typekit.net/jce0cum.css" />
            </Head>
            <Component {...pageProps} className="bg-darknavy-800" />
        </UserProvider>
    )
}

export default MyApp
