import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export const siteTitle = 'StatusPage'

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
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Link href="/">
        <header className="p-5 text-center cursor-pointer">
          <h1 className="title md:text-6xl text-4xl font-bold text-blue-500">Status Page</h1>
        </header>
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
