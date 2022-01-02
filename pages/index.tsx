import React from 'react'
import Head from 'next/head'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/layout'
import StatusCategory from '../components/StatusCategory';
import { RichCategory } from '../lib/services';
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
  return (
    <Layout home>
      <Head>
        <title>Status Page</title>
      </Head>
      {categoryList.map((c) => {
        return <StatusCategory key={c.id} category={c} />
      })}
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