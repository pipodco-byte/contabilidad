'use client'

import { useRef } from 'react'
import { Image } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onImageSelected: (base64: string) => void
  disabled?: boolean
}

export function ImageUpload({ onImageSelected, disabled = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      onImageSelected(base64)
    }
    reader.readAsDataURL(file)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={cn(
              "p-2 rounded-lg transition-all cursor-pointer",
              "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Image className="w-5 h-5" />
          </label>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Subir imagen</p>
      </TooltipContent>
    </Tooltip>
  )
}