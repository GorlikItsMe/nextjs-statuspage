import StatusService from './StatusService';
import { RichCategory } from '../lib/services';



export default function StatusCategory({ category }: { category: RichCategory }) {
  return (
    <div className='mx-auto bg-white rounded-xl shadow-lg p-5'>
      <h2 className='text-2xl'>{category.name}</h2>
      <div>
        {category.Service.map((s) => {
          return <StatusService key={s.categoryId} service={s} />
        })}
      </div>
    </div>
  )
}