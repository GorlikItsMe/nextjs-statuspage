import StatusService from './StatusService';
import { Category, StatusLog, Service } from '@prisma/client';


export default function StatusCategory({ category }: {
  category: Category & {
    Service: (Service & {
      StatusLog: StatusLog[];
    })[]
  }
}) {
  return (
    <div className='mx-auto bg-white rounded-xl shadow-lg p-5 mb-2'>
      <h2 className='text-2xl'>{category.name}</h2>
      <div>
        {category.Service.map((s) => {
          return <StatusService key={s.id} service={s} />
        })}
      </div>
    </div>
  )
}