"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Monitor,
  Globe,
  Mail,
  Smartphone,
  Lock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface UserProfile {
  name: string
  email: string
  avatar: string
  role: string
  department: string
  timezone: string
  language: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  desktop: boolean
  marketing: boolean
  security: boolean
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  accentColor: string
  compactMode: boolean
  animations: boolean
  fontSize: "small" | "medium" | "large"
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  loginNotifications: boolean
  dataEncryption: boolean
}

const settingsSections = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "security", name: "Security", icon: Shield },
  { id: "data", name: "Data & Export", icon: Database },
]

const accentColors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Pink", value: "#ec4899" },
]

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState("profile")
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  // Settings state
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@admybrand.com",
    avatar: "",
    role: "Analytics Manager",
    department: "Marketing",
    timezone: "UTC-5",
    language: "English"
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    desktop: true,
    marketing: false,
    security: true
  })

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
    accentColor: "#3b82f6",
    compactMode: false,
    animations: true,
    fontSize: "medium"
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    dataEncryption: true
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus("success")
      setHasChanges(false)
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    const data = {
      profile,
      notifications,
      appearance,
      security,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "admybrand-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.profile) setProfile(data.profile)
        if (data.notifications) setNotifications(data.notifications)
        if (data.appearance) setAppearance(data.appearance)
        if (data.security) setSecurity(data.security)
        setHasChanges(true)
      } catch (error) {
        console.error("Invalid settings file")
      }
    }
    reader.readAsText(file)
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          {profile.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="space-y-2">
          <Button variant="outline" size="sm">
            Change Avatar
          </Button>
          <p className="text-sm text-muted-foreground">
            Recommended: Square image, at least 200x200px
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Full Name</label>
          <Input
            value={profile.name}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, name: e.target.value }))
              setHasChanges(true)
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Email</label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, email: e.target.value }))
              setHasChanges(true)
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Role</label>
          <Input
            value={profile.role}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, role: e.target.value }))
              setHasChanges(true)
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Department</label>
          <Input
            value={profile.department}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, department: e.target.value }))
              setHasChanges(true)
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Timezone</label>
          <select
            value={profile.timezone}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, timezone: e.target.value }))
              setHasChanges(true)
            }}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">London (UTC+0)</option>
            <option value="UTC+1">Paris (UTC+1)</option>
            <option value="UTC+9">Tokyo (UTC+9)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Language</label>
          <select
            value={profile.language}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, language: e.target.value }))
              setHasChanges(true)
            }}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="German">Deutsch</option>
            <option value="Japanese">日本語</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Channels</h3>
        <div className="space-y-3">
          {[
            { key: "email", label: "Email Notifications", icon: Mail, description: "Receive notifications via email" },
            { key: "push", label: "Push Notifications", icon: Bell, description: "Browser push notifications" },
            { key: "sms", label: "SMS Notifications", icon: Smartphone, description: "Text message alerts for critical updates" },
            { key: "desktop", label: "Desktop Notifications", icon: Monitor, description: "Native desktop notifications" },
          ].map(({ key, label, icon: Icon, description }) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof NotificationSettings] as boolean}
                  onChange={(e) => {
                    setNotifications(prev => ({ ...prev, [key]: e.target.checked }))
                    setHasChanges(true)
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Types</h3>
        <div className="space-y-3">
          {[
            { key: "marketing", label: "Marketing Updates", description: "Product updates and promotional content" },
            { key: "security", label: "Security Alerts", description: "Account security and login notifications" },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof NotificationSettings] as boolean}
                  onChange={(e) => {
                    setNotifications(prev => ({ ...prev, [key]: e.target.checked }))
                    setHasChanges(true)
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all Dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "light", label: "Light", icon: Sun },
            { key: "dark", label: "Dark", icon: Moon },
            { key: "system", label: "System", icon: Monitor },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setAppearance(prev => ({ ...prev, theme: key as any }))
                setHasChanges(true)
              }}
              className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-all ${
                appearance.theme === key
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Accent Color</h3>
        <div className="grid grid-cols-6 gap-3">
          {accentColors.map(({ name, value }) => (
            <button
              key={value}
              onClick={() => {
                setAppearance(prev => ({ ...prev, accentColor: value }))
                setHasChanges(true)
              }}
              className={`w-12 h-12 rounded-lg border-2 transition-all ${
                appearance.accentColor === value
                  ? "border-gray-900 dark:border-white"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: value }}
              title={name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Display Options</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearance.compactMode}
                onChange={(e) => {
                  setAppearance(prev => ({ ...prev, compactMode: e.target.checked }))
                  setHasChanges(true)
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Animations</p>
              <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearance.animations}
                onChange={(e) => {
                  setAppearance(prev => ({ ...prev, animations: e.target.checked }))
                  setHasChanges(true)
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Font Size</label>
            <select
              value={appearance.fontSize}
              onChange={(e) => {
                setAppearance(prev => ({ ...prev, fontSize: e.target.value as any }))
                setHasChanges(true)
              }}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Authentication</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {security.twoFactorAuth && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSecurity(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))
                  setHasChanges(true)
                }}
              >
                {security.twoFactorAuth ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
              </div>
            </div>
            <select
              value={security.sessionTimeout}
              onChange={(e) => {
                setSecurity(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))
                setHasChanges(true)
              }}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={240}>4 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Privacy & Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Login Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.loginNotifications}
                onChange={(e) => {
                  setSecurity(prev => ({ ...prev, loginNotifications: e.target.checked }))
                  setHasChanges(true)
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Data Encryption</p>
              <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.dataEncryption}
                onChange={(e) => {
                  setSecurity(prev => ({ ...prev, dataEncryption: e.target.checked }))
                  setHasChanges(true)
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Download className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">Download your settings and data</p>
                </div>
              </div>
              <Button onClick={handleExportData} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Upload className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Import Data</h4>
                  <p className="text-sm text-muted-foreground">Restore from backup file</p>
                </div>
              </div>
              <label className="w-full">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <Button variant="outline" className="w-full cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Settings
                </Button>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Data Retention</h3>
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Automatic Data Cleanup</p>
              <p className="text-sm text-muted-foreground mt-1">
                Old analytics data is automatically archived after 2 years to optimize performance. 
                Archived data can be restored upon request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings()
      case "notifications":
        return renderNotificationSettings()
      case "appearance":
        return renderAppearanceSettings()
      case "security":
        return renderSecuritySettings()
      case "data":
        return renderDataSettings()
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-background border-l shadow-xl z-50 flex"
      >
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            {settingsSections.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </button>
            ))}
          </nav>

          {/* Save Status */}
          <AnimatePresence>
            {saveStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-6 p-3 rounded-lg flex items-center space-x-2 ${
                  saveStatus === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {saveStatus === "success" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {saveStatus === "success" ? "Settings saved!" : "Failed to save"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-6 capitalize">
                {activeSection} Settings
              </h3>
              {renderSectionContent()}
            </div>
          </div>

          {/* Action Bar */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t bg-background p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  You have unsaved changes
                </p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reset changes (implement proper state reset)
                      setHasChanges(false)
                    }}
                  >
                    Discard
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  )
}