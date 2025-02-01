'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { fetchLogin } from '@/services/UserServices'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'

export function LoginForm({
  onClick,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: fetchLogin,
    onSuccess: () => {
      toast({
        title: 'Berhasil!',
        description: 'Login berhasil.',
        variant: 'default',
      })
      router.push('/dashboard')
    },
    onError: (error) => {
      toast({
        title: 'Gagal!',
        description: error.message || 'Login gagal',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ username, password })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{' '}
            <a
              onClick={onClick}
              className="cursor-pointer underline underline-offset-4"
            >
              Daftar
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
