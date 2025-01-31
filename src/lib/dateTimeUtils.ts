export const formatToWIB = (date: unknown): string => {
  if (date instanceof Date) {
    return `${date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} WIB`
  }

  if (typeof date === 'string' || typeof date === 'number') {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date')
    }
    return `${dateObj.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} WIB`
  }

  throw new Error('Invalid date type')
}

// Fungsi untuk membuat datetime dengan tanggal saat ini dan waktu yang diberikan
export const formatClockTimes = (data: {
  clockIn: string
  clockOut: string
}) => {
  // Mengambil tanggal hari ini (YYYY-MM-DD)
  const currentDate = new Date().toISOString().split('T')[0]

  // Membuat format datetime untuk clockIn dan clockOut
  const clockInDatetime = `${currentDate}T${data.clockIn}:00`
  const clockOutDatetime = `${currentDate}T${data.clockOut}:00`

  // Memperbarui data dengan format yang diinginkan
  return {
    ...data,
    clockIn: clockInDatetime,
    clockOut: clockOutDatetime,
  }
}

export const parseClockTimes = (data: {
  clockIn: string
  clockOut: string
}) => {
  // Mengambil waktu jam dan menit dari datetime dalam format 24 jam (tanpa AM/PM)
  const clockInTime = new Date(data.clockIn).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Menetapkan format 24 jam
  })
  const clockOutTime = new Date(data.clockOut).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Menetapkan format 24 jam
  })

  // Mengembalikan data dengan format waktu yang diinginkan
  return {
    ...data,
    clockIn: clockInTime,
    clockOut: clockOutTime,
  }
}
