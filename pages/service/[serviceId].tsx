import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';
import { Service, StatusLog, Event } from '@prisma/client';
import Layout from '../../components/layout';
import Head from 'next/head';
import TimeAgo from 'javascript-time-ago'
import pl from 'javascript-time-ago/locale/pl.json'
import EventInfo from '../../components/EventInfo';

TimeAgo.addLocale(pl)

interface ServicePageProps {
    service: Service & {
        Event: Event[];
        StatusLog: StatusLog[];
    }
}
export default function ServicePage({ service }: ServicePageProps) {
    const [uptimeStr, setUptimeStr] = useState("...")
    const timeAgo = new TimeAgo('pl')

    let isRed = true;
    if (service.StatusLog.length != 0) {
        isRed = !service.StatusLog[0].isOnline;
    }

    useEffect(() => {
        let loop = setInterval(() => {
            let d = service.Event[service.Event.length - 1].dtStart
            let msg = timeAgo.format(d) as string
            setUptimeStr(msg)
        }, 1000)
        return () => { clearInterval(loop) }
    }, [uptimeStr])


    return (
        <Layout>
            <Head>
                <title>Status Page</title>
            </Head>

            {isRed &&
                <div className='mx-auto bg-red-100 rounded-xl shadow-lg p-2 px-4 mb-1 flex flex-row cursor-pointer'>
                    <div className='basis-3/4'>{service.name}</div>
                    <div className='text-red-500 text-sm basis-1/4 text-right'>Outage</div>
                </div>
            }
            {!isRed &&
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

    // get service
    const service = await prisma.service.findUnique({
        where: { id: sid },
        include: {
            Event: {
                take: 5,
                orderBy: {
                    dtStart: "desc"
                }
            },
            StatusLog: {
                take: 1,
                orderBy: {
                    dt: "desc",
                }
            }
        }
    })
    if (service == null) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
            props: {},
        };
    }
    return { props: { sid, service } };
}
