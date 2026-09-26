
import { createBrowserRouter } from 'react-router-dom'

import { MainLayout } from '../components/layout/MainLayout'
import { HomePage } from '../pages/HomePage'
import { ProfilePage } from '../pages/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
])