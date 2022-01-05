import React from 'react'
import { Event } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp, faArrowAltCircleDown } from '@fortawesome/free-regular-svg-icons'
import timeSince from '../lib/timeSince'

interface EventInfoProps {
    event: Event
    isNow?: Boolean
}

export default function EventInfo({ event, isNow }: EventInfoProps) {
    let agoStr = timeSince(event.dtStart, event.dtEnd)
    let dtStr = `${event.dtStart.toLocaleString()} - ${event.dtEnd.toLocaleString()}`
    let isNowClassName = ""
    if (isNow) {
        dtStr = `${event.dtStart.toLocaleString()} - now`
        isNowClassName = 'mb-4'
    }

    if (event.isOnline) {
        return (
            <div className={`bg-green-50 hover:bg-green-100 rounded-xl shadow-lg p-4 mb-2 ${isNowClassName}`} >
                <div className='flex items-center'>
                    <FontAwesomeIcon icon={faArrowAltCircleUp} className='h-6 text-green-500' />
                    <div className='ml-2'>Running again</div>
                </div>
                <div className='text-gray-600 text-xs'>{dtStr}</div>
            </div >
        )
    }
    return (
        <div className={`bg-red-50 hover:bg-red-100 rounded-xl shadow-lg p-4 mb-2 ${isNowClassName}`}>
            <div className='flex items-center'>
                <FontAwesomeIcon icon={faArrowAltCircleDown} className='h-6 text-red-500' />
                <div className='ml-2'>Down for {agoStr}</div>
            </div>
            <div className='text-gray-600 text-xs'>{dtStr}</div>
        </div>
    )
}