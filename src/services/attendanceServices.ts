export async function createAttendance(data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attendances`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    },
  )
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}
