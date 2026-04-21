"use client"

import * as React from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Search,
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  FileText,
  Settings,
  Plus,
  Download,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [theme, setTheme] = React.useState<"dark" | "light">("dark")

  const navigate = (href: string) => {
    router.push(href)
    onOpenChange(false)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-sm">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-14 [&_[cmdk-input]]:text-base [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b border-white/10 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
            <Command.Input
              placeholder="Buscar comandos..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-zinc-500">
              No se encontraron comandos.
            </Command.Empty>
            <Command.Group heading="Navegación">
              <CommandItem
                icon={LayoutDashboard}
                label="Dashboard"
                shortcut="G D"
                onSelect={() => navigate("/dashboard")}
              />
              <CommandItem
                icon={ArrowLeftRight}
                label="Transacciones"
                shortcut="G T"
                onSelect={() => navigate("/transacciones")}
              />
              <CommandItem
                icon={BarChart3}
                label="Gráficas"
                shortcut="G G"
                onSelect={() => navigate("/graficas")}
              />
              <CommandItem
                icon={FileText}
                label="Informes"
                shortcut="G I"
                onSelect={() => navigate("/informes")}
              />
              <CommandItem
                icon={Settings}
                label="Configuración"
                shortcut="G S"
                onSelect={() => navigate("/configuracion")}
              />
            </Command.Group>
            <Command.Group heading="Acciones">
              <CommandItem
                icon={Plus}
                label="Nueva Transacción"
                shortcut="N"
                onSelect={() => {
                  navigate("/transacciones?new=true")
                }}
              />
              <CommandItem
                icon={Download}
                label="Exportar Datos"
                shortcut="E"
                onSelect={() => {
                  console.log("Exporting data...")
                  onOpenChange(false)
                }}
              />
              <CommandItem
                icon={theme === "dark" ? Sun : Moon}
                label={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
                shortcut="T"
                onSelect={toggleTheme}
              />
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

interface CommandItemProps {
  icon: React.ElementType
  label: string
  shortcut?: string
  onSelect: () => void
}

function CommandItem({ icon: Icon, label, shortcut, onSelect }: CommandItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm text-zinc-300 outline-none transition-colors",
        "hover:bg-violet-950/50 hover:text-violet-300",
        "data-[selected=true]:bg-violet-500/20 data-[selected=true]:text-violet-300",
        "focus:bg-violet-950/50 focus:text-violet-300"
      )}
    >
      <Icon className="mr-3 h-4 w-4 text-zinc-400" />
      <span className="flex-1">{label}</span>
      {shortcut && (
        <kbd className="ml-auto text-xs text-zinc-500">{shortcut}</kbd>
      )}
    </Command.Item>
  )
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return { open, setOpen }
}