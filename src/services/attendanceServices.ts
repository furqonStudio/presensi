export async function createAttendance(data: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/attendances`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (!response.ok) {
      const errorDetails = await response.json()
      console.error('API error:', errorDetails)
      throw new Error(errorDetails.error || 'Network response was not ok')
    }

    return response.json()
  } catch (error: any) {
    throw new Error(error.message || 'Terjadi kesalahan saat membuat absensi.')
  }
}
