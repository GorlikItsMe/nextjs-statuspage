import { AppProps } from 'next/app'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App
