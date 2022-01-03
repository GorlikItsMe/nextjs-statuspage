import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Layout from '../components/layout'
import StatusCategory from '../components/StatusCategory';
import prisma from '../lib/prisma'
import { Category, Service, StatusLog } from '@prisma/client';


export default function StatusPage({
  categoryList
}: {
  categoryList: (Category & {
    Service: (Service & {
      StatusLog: StatusLog[];
    })[];
  })[]
}) {
  const UPDATE_EVERY = 30; // SECONDS
  const [updateTimeSec, setUpdateTimeSec] = useState(30);
  const [categoryListFromApi, setCategoryList] = useState(categoryList);

  useEffect(() => {
    let start = UPDATE_EVERY
    let loop = setInterval(() => {
      if (start != 0) {
        start = start - 1
        setUpdateTimeSec(start)
      }
      if (start == 0) {
        fetch('/api/status')
          .then(r => r.json())
          .then((data: (Category & {
            Service: (Service & {
              StatusLog: StatusLog[];
            })[];
          })[]) => {
            data.forEach((c) => {
              c.Service.forEach((s) => {
                s.StatusLog.forEach((sl) => {
                  if (typeof sl.dt == "string") {
                    sl.dt = new Date(sl.dt)
                  }
                })
              })
            })
            setCategoryList(data)
          })
        console.log("Update status")
        start = UPDATE_EVERY;
      }
    }, 1000)
    return (() => { clearInterval(loop) })
  }, [])

  const getLastUpdateDate = () => {
    let oldest_dt = new Date();
    categoryListFromApi.forEach((c) => {
      c.Service.forEach(s => {
        s.StatusLog.forEach(sl => {
          if (oldest_dt > sl.dt) {
            // found new oldest update date
            oldest_dt = sl.dt
          }
        })
      })
    })
    return oldest_dt
  }

  const getLastUpdateDateString = () => {
    const dtnow = new Date().getTime();
    const d = Math.round(Math.abs((dtnow - getLastUpdateDate().getTime()) / 1000));
    if (d < 60) { return `${d} sec ago` }
    if (d < 60 * 60) { return `${Math.round(d / 60)} min ago` }
    return `${d}`
  }

  return (
    <Layout home>
      <Head>
        <title>Status Page</title>
      </Head>
      {categoryListFromApi && categoryListFromApi.map((c) => {
        return <StatusCategory key={c.id} category={c} />
      })}
      <div className="text-sm p-2 flex flex-row">
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

export const getServerSideProps: GetServerSideProps = async () => {
  const categoryList = await prisma.category.findMany({
    include: {
      Service: {
        include: {
          StatusLog: {
            take: 1,
            orderBy: {
              dt: "desc",
            }
          }
        }
      }
    },
  });
  return {
    props: {
      categoryList
    }
  }
}