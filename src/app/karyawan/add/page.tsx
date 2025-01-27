'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Container } from '@/components/container'
import Link from 'next/link'

export default function AddEmployeeForm() {
  const [formData, setFormData] = useState({
    nama: '',
    contact: '',
    position: '',
    joinDate: new Date(),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Employee data submitted:', formData)
      setIsSubmitting(false)
      alert('Karyawan berhasil ditambahkan!')
    }, 1000)
  }

  return (
    <Container>
      <h2 className="text-xl font-bold">Tambah Karyawan</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama */}
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            name="name"
            placeholder="Masukkan nama karyawan"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="contact">Kontak</Label>
          <Input
            id="contact"
            name="contact"
            type="number"
            placeholder="Masukkan kontak karyawan"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        {/* Jabatan */}
        <div>
          <Label htmlFor="position">Jabatan</Label>
          <Input
            id="position"
            name="position"
            placeholder="Masukkan jabatan karyawan"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tanggal Bergabung */}
        <div>
          <Label htmlFor="joinDate">Tanggal Bergabung</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.joinDate && 'text-muted-foreground',
                )}
              >
                {formData.joinDate ? (
                  formatDate(formData.joinDate)
                ) : (
                  <span>Pilih tanggal</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.joinDate}
                onSelect={(date) =>
                  setFormData({ ...formData, joinDate: date! })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Tombol Submit */}
        <div className="flex gap-2">
          <Button variant={'secondary'} className="w-full">
            <Link href="/karyawan">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Menambahkan...' : 'Tambah Karyawan'}
          </Button>
        </div>
      </form>
    </Container>
  )
}
