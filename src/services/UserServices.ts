interface LoginData {
  username: string
  password: string
}

export async function fetchLogin(data: LoginData) {
  console.log('🚀 ~ fetchLogin ~ data:', data)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    throw new Error('Login gagal, periksa kembali kredensial Anda')
  }

  const responseData = await response.json()

  // Simpan token di cookie
  document.cookie = `authToken=${responseData.token}; path=/; expires=${getCookieExpirationDate()}; secure; samesite=strict`

  return responseData
}

function getCookieExpirationDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toUTCString()
}

export function logout() {
  // Hapus cookie dengan mengatur expires ke waktu yang telah lewat
  document.cookie =
    'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict'
}
