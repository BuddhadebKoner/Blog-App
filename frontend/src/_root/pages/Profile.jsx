import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { isAuthenticated, isAuthenticatedLoading, currentUser } = useAuth();

  return (
    <div>Profile</div>
  )
}

export default Profile