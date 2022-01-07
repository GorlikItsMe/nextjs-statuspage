import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout';
import Head from 'next/head';
import EventInfo from '../../components/EventInfo';
import timeSince from '../../lib/timeSince';
import type { StatusApiOutput, StatusApiOutputService } from '../api/status';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';

export default function ServicePage({ sid }: { sid: number }) {
    const [uptimeStr, setUptimeStr] = useState("")
    const [service, setService] = useState<StatusApiOutputService>(null);
    const router = useRouter();

    const updateService = () => {
        fetch('/api/status')
            .then(r => r.json())
            .then((data: StatusApiOutput) => {
                for (let i = 0; i < data.length; i++) {
                    let x = data[i].Service.find((s) => { return s.id == sid }, undefined)
                    if (x != undefined) {
                        setService(x)
                        return // found service
                    }
                }
                setService(undefined) // dont found service
            })
    }

    useEffect(() => { updateService() }, [])
    useEffect(() => {
        if (service === undefined) {
            console.error(`Service with this id (${sid}) not found`)
            router.push("/")
        }
        if (service) {
            let loop = setInterval(() => {
                setUptimeStr(timeSince(service.upSince, new Date()))
            }, 1000)
            return () => { clearInterval(loop); }
        }
    }, [service, router])


    return (
        <Layout>
            <Head>
                <title>Status Page</title>
            </Head>
            {!service && <Loading />}
            {service &&
                <div className='mx-2'>
                    {!service.isOnline &&
                        <div className='mx-auto bg-red-100 rounded-xl shadow-lg p-2 px-4 mb-1 flex flex-row cursor-pointer'>
                            <div className='basis-3/4'>{service.name}</div>
                            <div className='text-red-500 text-sm basis-1/4 text-right'>Outage</div>
                        </div>
                    }
                    {service.isOnline &&
                        <div className='mx-auto bg-green-100 rounded-xl shadow-lg p-2 px-4 mb-1 flex flex-row items-center cursor-pointer'>
                            <div className='text-3xl basis-3/4'>{service.name}</div>
                            <div className='text-green-500 text-sm basis-1/4 text-right'>Operational</div>
                        </div>
                    }

                    <div className="mx-auto rounded-xl shadow-lg p-2 px-4 mt-4 mb-1 bg-white flex flex-row items-center">
                        <div className='text-2xl basis-1/2'>Uptime</div>
                        <div className='text-1xl basis-1/2 text-right'>{uptimeStr}</div>
                    </div>

                    <div className="mx-auto rounded-xl shadow-lg p-2 px-4 mt-4 mb-1 bg-white">
                        <h2 className='text-2xl mb-2'>Last 5 events</h2>
                        {service.Event.map((e) => {
                            let isLast = (service.Event[0].id == e.id)
                            return <EventInfo key={e.id} event={e} isNow={isLast} />
                        })}
                    </div>
                </div>
            }
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({
    query
}) => {
    // get service id (and check it)
    const serviceId = query['serviceId'] as string;
    let sid = parseInt(serviceId);
    if (isNaN(sid)) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
            props: {},
        };
    }
    return { props: { sid } };
}
