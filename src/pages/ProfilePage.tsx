import React from 'react'
import AuthGuard from '@/components/AuthGuard'

const ProfilePage: React.FC = () => {
  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
    </AuthGuard>
  )
}

export default ProfilePage
