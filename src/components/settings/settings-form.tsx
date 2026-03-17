"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { 
  User as UserIcon, 
  Bell, 
  Shield, 
  Palette, 
  CreditCard,
  Zap,
  Save,
  Check
} from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { updateProfile } from "@/server/actions/settings"
import { toast } from "sonner"

interface SettingsFormProps {
  user: {
    name: string
    email: string
    image?: string | null
    bio?: string | null
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  const handleSave = async (formData: FormData) => {
    setIsSaving(true)
    const result = await updateProfile(formData)
    setIsSaving(false)

    if (result.success) {
      toast.success("Profile updated successfully")
    } else {
      toast.error(typeof result.error === "string" ? result.error : "Failed to update profile")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Tabs */}
      <div className="lg:col-span-3 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-indigo text-white shadow-lg shadow-indigo/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="lg:col-span-9">
        <GlassCard className="space-y-8">
          {activeTab === "profile" && (
            <motion.form 
              action={handleSave}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-indigo/30 group-hover:border-indigo transition-colors duration-500">
                    <AvatarImage src={user.image || "https://github.com/shadcn.png"} />
                    <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-indigo rounded-full border-2 border-[#1C1C27] text-white shadow-lg">
                    <Palette className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-white">Public Profile</h3>
                  <p className="text-xs text-muted-foreground">This information will be displayed on your client-facing portal.</p>
                  <div className="flex gap-2">
                    <Badge className="bg-indigo/10 text-indigo border-indigo/20">Pro Member</Badge>
                    <Badge variant="outline" className="border-white/10 text-white">Consultant</Badge>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    defaultValue={user.name}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed opacity-70"
                  />
                  <p className="text-[10px] text-muted-foreground/50">Email cannot be changed.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bio / Elevator Pitch</label>
                  <textarea 
                    name="bio"
                    rows={3}
                    defaultValue={user.bio || ""}
                    placeholder="Tell your clients what you do..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo/50 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-indigo text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Check className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </motion.button>
              </div>
            </motion.form>
          )}

          {activeTab === "appearance" && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-white">Visual Interface</h3>
                <p className="text-xs text-muted-foreground">Customize how the workspace feels to you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 rounded-2xl bg-white/5 border-2 border-indigo flex flex-col items-center gap-3">
                  <div className="h-12 w-full bg-[#08080E] rounded-lg border border-white/10" />
                  <span className="text-sm font-medium">Dark Mode (Default)</span>
                </button>
                <button className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3 opacity-50 cursor-not-allowed">
                  <div className="h-12 w-full bg-white rounded-lg border border-zinc-200" />
                  <span className="text-sm font-medium">Light Mode</span>
                </button>
                <button className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3 opacity-50 cursor-not-allowed">
                  <div className="h-12 w-full bg-indigo/20 rounded-lg border border-indigo/30" />
                  <span className="text-sm font-medium">Glass Tinted</span>
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Accent Color</h4>
                <div className="flex gap-3">
                  {["#6366F1", "#2DD4BF", "#EC4899", "#F59E0B"].map((color) => (
                    <button 
                      key={color} 
                      type="button"
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                        color === "#6366F1" ? "border-white" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== "profile" && activeTab !== "appearance" && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground/30">
                <Zap className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">Advanced Feature</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">This module is part of the <span className="text-indigo-400 font-bold">Pro Package</span> coming in Q3 2025.</p>
              </div>
              <button type="button" className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors">
                Join Waitlist
              </button>
            </div>
          )}
        </GlassCard>

        {/* Upgrade Card */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-tr from-indigo/20 via-teal/10 to-transparent border border-indigo/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-indigo/20 blur-3xl rounded-full group-hover:bg-indigo/30 transition-colors" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">Elevate your agency with Pro</h3>
              <p className="text-sm text-muted-foreground">Unlock multi-client portals, unlimited projects, and advanced financial analytics.</p>
            </div>
            <button type="button" className="whitespace-nowrap px-6 py-3 bg-white text-indigo font-bold rounded-xl shadow-xl hover:bg-indigo-50 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
