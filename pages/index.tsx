import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import StatusCategory from '../components/StatusCategory';
import type { StatusApiOutput } from './api/status';
import Loading from '../components/Loading';


export default function StatusPage() {
  const UPDATE_EVERY = 30; // SECONDS
  const [updateTimeSec, setUpdateTimeSec] = useState(30);
  const [statusApiResponse, setStatusApiResponse] = useState<StatusApiOutput>([]);

  const updateStatus = () => {
    fetch('/api/status')
      .then(r => r.json())
      .then(data => setStatusApiResponse(data))
  }

  // on start Load statusApiResponse
  useEffect(() => { updateStatus() }, [])

  useEffect(() => {
    let start = UPDATE_EVERY
    let loop = setInterval(() => {
      if (start != 0) {
        start = start - 1
        setUpdateTimeSec(start)
      }
      if (start == 0) {
        updateStatus();
        start = UPDATE_EVERY;
      }
    }, 1000)
    return (() => { clearInterval(loop) })
  }, [])

  const getLastUpdateDateString = () => {
    if (statusApiResponse.length == 0) { return "..." }

    const dtnow = new Date().getTime();
    const lastUpdateDate = new Date(statusApiResponse[0].updatedAt).getTime()

    const d = Math.round(Math.abs((dtnow - lastUpdateDate) / 1000));
    if (d < 60) { return `${d} sec ago` }
    if (d < 60 * 60) { return `${Math.round(d / 60)} min ago` }
    return `${d}`
  }

  return (
    <Layout home>
      <Head>
        <title>Status Page</title>
      </Head>

      <div className='mx-2'>
        {statusApiResponse && statusApiResponse.map((c) => {
          return <StatusCategory key={c.id} category={c} />
        })}
        {
          statusApiResponse.length == 0 && <Loading />
        }
      </div>
      <div className="text-sm p-2 mx-2 flex flex-row">
        <div className="basis-1/2 text-gray-600">
          Refresh in {updateTimeSec} seconds
        </div>
        <div className="basis-1/2 text-right text-gray-600">
          updated {getLastUpdateDateString()}
        </div>
      </div>
    </Layout>
  )
}
