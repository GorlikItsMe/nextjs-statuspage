import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export const siteTitle = 'StatusPage'
const iconUrl = 'https://status.gorlik.pl/images/logo.png'

export default function Layout({
  children,
  home
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <div className="container mx-auto">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Services uptime, status and all systems health"
        />
        <meta
          property="og:image"
          content={`https://og.zakku.eu/*${encodeURI(
            siteTitle
          )}*.png?theme=dark&md=1&fontSize=125px&images=${encodeURIComponent(iconUrl)}&widths=350&heights=350`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Link href="/" passHref>
        <a>
          <header className="p-5 text-center cursor-pointer">
            <h1 className="title md:text-6xl text-4xl font-bold text-blue-500">Status Page</h1>
          </header>
        </a>
      </Link>
      <main>{children}</main>
      {!home && (
        <div className="mx-4">
          <Link href="/">
            <a className='flex items-center'>
              <FontAwesomeIcon icon={faArrowLeft} className='h-4 mr-1' />
              Back to home
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}
