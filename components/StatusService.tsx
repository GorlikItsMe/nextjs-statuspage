import { Service } from '@prisma/client';


export default function StatusService({ service }: { service: Service }) {
  var isRed = !service.isOnline;

  if (isRed) {
    return (
      <div className='mx-auto bg-red-100 rounded-xl shadow-lg p-2 px-4 mb-1 flex flex-row'>
        <div className='basis-3/4'>{service.name}</div>
        <div className='text-red-500 text-sm basis-1/4 text-right'>Outage</div>
      </div>
    )
  }
  return (
    <div className='mx-auto bg-green-50 rounded-xl shadow-lg p-2 px-4 mb-1 flex flex-row'>
      <div className='basis-3/4'>{service.name}</div>
      <div className='text-green-500 text-sm basis-1/4 text-right'>Operational</div>
    </div>
  )
}