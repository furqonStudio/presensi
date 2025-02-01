'use client'
import { useEffect, useState } from 'react'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isRegister, setIsRegister] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Ganti dengan pengecekan login yang sesuai
    const isLoggedIn = Boolean(localStorage.getItem('authToken')) // atau sesuaikan dengan pengecekan status login Anda

    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }, [router])

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-green-950 to-blue-950 p-4">
      {isRegister ? (
        <RegisterForm className="w-96" onClick={() => setIsRegister(false)} />
      ) : (
        <LoginForm className="w-96" onClick={() => setIsRegister(true)} />
      )}
    </div>
  )
}
