import React from 'react'
import { Event } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp, faArrowAltCircleDown } from '@fortawesome/free-regular-svg-icons'

var timeSince = (dtStart: Date, dtEnd: Date) => {
    var seconds = Math.floor((dtEnd.getTime() - dtStart.getTime()) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                    }
                }
            }
        }
    }
    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }
    return interval + ' ' + intervalType;
};

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
            <div className={`bg-green-50 rounded-xl shadow-lg p-4 mb-2 ${isNowClassName}`} >
                <div className='flex'>
                    <FontAwesomeIcon icon={faArrowAltCircleUp} className='h-6 text-green-500' />
                    <div className='ml-2'>Running again</div>
                </div>
                <div className='text-gray-600 text-xs'>{dtStr}</div>
            </div >
        )
    }
    return (
        <div className={`bg-red-50 rounded-xl shadow-lg p-4 mb-2 ${isNowClassName}`}>
            <div className='flex'>
                <FontAwesomeIcon icon={faArrowAltCircleDown} className='h-6 text-red-500' />
                <div className='ml-2'>Down for {agoStr}</div>
            </div>
            <div className='text-gray-600 text-xs'>{dtStr}</div>
        </div>
    )
}