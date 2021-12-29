import React from 'react'
import Head from 'next/head'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getServicesData } from '../lib/services'
import Layout from '../components/layout'
import StatusCategory from '../components/StatusCategory';
import { RichCategory } from '../lib/services';


export default function StatusPage({
  categoryList
}: {
  categoryList: RichCategory[]
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
  const categoryList = await getServicesData()
  return {
    props: {
      categoryList
    }
  }
}