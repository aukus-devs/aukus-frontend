import { createContext, useContext, useState } from 'react'

type TimeContextType = {
  loadTime: number
}

const TimeContext = createContext<TimeContextType | null>(null)

export function useTime() {
  return useContext(TimeContext)
}

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [loadTime] = useState(Date.now())
  return (
    <TimeContext.Provider value={{ loadTime }}>{children}</TimeContext.Provider>
  )
}
