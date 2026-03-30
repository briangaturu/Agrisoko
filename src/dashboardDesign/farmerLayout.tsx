import { Outlet } from 'react-router-dom'
import Card from './card'
import { FarmerSideNav } from './farmerNav'

export const FarmerLayout = () => {
  return (
    <div className='flex max-h-fit min-h-full bg-gradient-to-br from-green-50 via-emerald-50 to-green-100'>
      <div className='min-w-[12%]'>
        <FarmerSideNav />
      </div>
      <div className='flex flex-col min-w-[80%]'>
        <div className="h-fit">
          <Card>
            <Outlet />
          </Card>
        </div>
      </div>
    </div>
  )
}