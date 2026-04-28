'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePaginatedTransactions } from '@/hooks/usePaginatedTransactions'
import { TransactionTable } from '@/components/tables/transaction-table'
import { TransaccionForm } from '@/components/forms/transaccion-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'

export default function TransaccionesPage() {
  const { user, loading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const {
    transacciones,
    loading: txLoading,
    selectedYear,
    selectedMonth,
    currentPage,
    totalPages,
    totalCount,
    setSelectedYear,
    setSelectedMonth,
    nextPage,
    prevPage,
    goToPage,
    firstPage,
    lastPage,
  } = usePaginatedTransactions(user?.id || '', user?.rol || 'usuario', debouncedQuery)

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Nueva Transacción Button */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Transacción
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <TransaccionForm
          userId={user.id}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por descripción..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
        />
      </div>

      {/* Table */}
      <TransactionTable
        userId={user.id}
        userRole={user.rol}
        transacciones={transacciones}
        loading={txLoading}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
        nextPage={nextPage}
        prevPage={prevPage}
        goToPage={goToPage}
        firstPage={firstPage}
        lastPage={lastPage}
        searchQuery={debouncedQuery}
      />
    </div>
  )
}
