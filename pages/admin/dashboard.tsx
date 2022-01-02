import React, { useEffect } from 'react'
import Head from 'next/head'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getServicesData } from '../../lib/services'
import Layout from '../../components/layout'
import StatusCategory from '../../components/StatusCategory';
import { RichCategory } from '../../lib/services';

export default function AdminPage() {

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        console.log(data)
      })
  }, [])


  return (
    <Layout home>
      <Head>
        <title>Status Page (Admin)</title>
      </Head>

      tutaj będzie jakiś daszbord
    </Layout>
  )
}

