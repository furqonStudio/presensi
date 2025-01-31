import { Office } from '@/types/office'

export async function fetchOffices(): Promise<Office[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offices`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const deleteOffice = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/offices/${id}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to delete office')
  }

  return id
}
