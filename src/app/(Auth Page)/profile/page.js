'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { client } from '@/lib/pocketbase'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function EditProfile() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile.',
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      if (avatar) {
        formData.append('avatar', avatar)
      }

      const updatedUser = await client.collection('users').update(user.id, formData)

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      })

      // Update the user in the AuthContext
      // Note: This might not be necessary if your AuthContext is already listening for changes
      // to the auth store. If it is, you can remove this line.
      // setUser(updatedUser)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Error',
        description: error?.message || 'Failed to update profile',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center">Please log in to edit your profile.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar ? `${client.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}` : ''} alt={name} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Label htmlFor="avatar">Profile Picture</Label>
            <Input id="avatar" type="file" onChange={handleAvatarChange} accept="image/*" />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}