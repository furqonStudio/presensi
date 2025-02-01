'use client'
import { useState } from 'react'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'

export default function Home() {
  const [isRegister, setIsRegister] = useState(false)

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
