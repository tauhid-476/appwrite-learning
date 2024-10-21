import { users } from '@/models/server/config'
import { UserPrefs } from '@/store/auth'
import React from 'react'

const EditPage = async( params : { userId: string, userSlug: string}) => {
  const user = await users.get<UserPrefs>(params.userId)
  return (
    <div>EditPage</div>
  )
}

export default EditPage