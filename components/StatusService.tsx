import { Service, StatusLog } from '@prisma/client';
import Link from 'next/link';



export default function StatusService({ service }: {
  service: (Service & {
    StatusLog: StatusLog[];
  })
}) {
  let isRed = true;
  if (service.StatusLog.length != 0) {
    isRed = !service.StatusLog[0].isOnline;
  }

  if (isRed) {
    return (
      <Link href={`/service/${service.id}`} passHref>
        <div className='mx-auto bg-red-100 rounded-xl shadow-lg p-2 px-4 mb-1 flex items-center flex-row cursor-pointer hover:bg-red-200'>
          <div className='basis-3/4'>{service.name}</div>
          <div className='text-red-500 text-sm basis-1/4 text-right'>Outage</div>
        </div>
      </Link>
    )
  }
  return (
    <Link href={`/service/${service.id}`} passHref>
      <div className='mx-auto bg-green-100 rounded-xl shadow-lg p-2 px-4 mb-1 flex items-center flex-row cursor-pointer hover:bg-green-200'>
        <div className='basis-3/4'>{service.name}</div>
        <div className='text-green-500 text-sm basis-1/4 text-right'>Operational</div>
      </div>
    </Link>
  )
}