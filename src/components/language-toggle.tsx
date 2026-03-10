"use client"

import { useUIStore } from "@/store/ui-store"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export function LanguageToggle() {
  const { language, setLanguage } = useUIStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Sync store with cookie on mount
    const savedLang = Cookies.get("NEXT_LOCALE") as "en" | "th"
    if (savedLang && savedLang !== language) {
      setLanguage(savedLang)
    }
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-10 px-0">
        --
      </Button>
    )
  }

  const toggleLanguage = () => {
    const newLang = language === "en" ? "th" : "en"
    setLanguage(newLang)
    
    // Set cookie for server components
    Cookies.set("NEXT_LOCALE", newLang, { expires: 365, path: '/' })
    
    // Refresh to update server components
    window.location.reload()
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="font-bold text-sm hover:bg-muted"
    >
      {language === "en" ? "EN" : "TH"}
    </Button>
  )
}
