import StatusService from './StatusService';
import type { StatusApiOutputCategory } from '../pages/api/status';


export default function StatusCategory({ category }: {
  category: StatusApiOutputCategory
}) {
  return (
    <div className='mx-auto bg-white rounded-xl shadow-lg p-5 mb-2'>
      <h2 className='text-2xl'>{category.name}</h2>
      <div className='mt-1'>
        {category.Service.map((s) => {
          return <StatusService key={s.id} service={s} />
        })}
      </div>
    </div>
  )
}