import { Outlet } from 'react-router-dom'
import Card from './card'
import { TopNav } from './sideNav'  // ← make sure this export name matches

export const Layout = () => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100'>
            <div className='flex flex-col min-h-screen'>
                <TopNav />
                <main className='flex-1 p-4 md:p-6 w-full'>
                    <Card>
                        <Outlet />
                    </Card>
                </main>
            </div>
        </div>
    );
};