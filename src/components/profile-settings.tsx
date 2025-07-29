"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Save,
  X,
  Upload,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ProfileSettingsProps {
  isOpen: boolean
  onClose: () => void
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string
  department: string
  location: string
  bio: string
  avatar: string
  joinDate: string
  lastLogin: string
}

export function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@admybrand.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Senior Analytics Manager",
    department: "Digital Marketing",
    location: "San Francisco, CA",
    bio: "Experienced analytics professional with 5+ years in digital marketing. Passionate about data-driven insights and business growth.",
    avatar: "",
    joinDate: "March 15, 2022",
    lastLogin: "Today at 2:30 PM"
  })

  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [showPassword, setShowPassword] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus("success")
      setIsEditing(false)
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setProfile(prev => ({ ...prev, avatar: result }))
          setIsEditing(true)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              `${profile.firstName[0]}${profile.lastName[0]}`
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAvatarUpload}
            className="absolute -bottom-1 -right-1 rounded-full p-2 h-8 w-8"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h3>
          <p className="text-muted-foreground">{profile.jobTitle}</p>
          <p className="text-sm text-muted-foreground">{profile.department}</p>
        </div>
      </div>

      {/* Personal Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">First Name</label>
          <Input
            value={profile.firstName}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, firstName: e.target.value }))
              setIsEditing(true)
            }}
            disabled={!isEditing && activeTab === "personal"}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Last Name</label>
          <Input
            value={profile.lastName}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, lastName: e.target.value }))
              setIsEditing(true)
            }}
            disabled={!isEditing && activeTab === "personal"}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => {
                setProfile(prev => ({ ...prev, email: e.target.value }))
                setIsEditing(true)
              }}
              className="pl-10"
              disabled={!isEditing && activeTab === "personal"}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={profile.phone}
              onChange={(e) => {
                setProfile(prev => ({ ...prev, phone: e.target.value }))
                setIsEditing(true)
              }}
              className="pl-10"
              disabled={!isEditing && activeTab === "personal"}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Job Title</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={profile.jobTitle}
              onChange={(e) => {
                setProfile(prev => ({ ...prev, jobTitle: e.target.value }))
                setIsEditing(true)
              }}
              className="pl-10"
              disabled={!isEditing && activeTab === "personal"}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={profile.location}
              onChange={(e) => {
                setProfile(prev => ({ ...prev, location: e.target.value }))
                setIsEditing(true)
              }}
              className="pl-10"
              disabled={!isEditing && activeTab === "personal"}
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="text-sm font-medium mb-2 block">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => {
            setProfile(prev => ({ ...prev, bio: e.target.value }))
            setIsEditing(true)
          }}
          rows={4}
          className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
          disabled={!isEditing && activeTab === "personal"}
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  )

  const renderAccountInfo = () => (
    <div className="space-y-6">
      {/* Account Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Account Status</h4>
              <p className="text-sm text-muted-foreground">Your account is active and verified</p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{profile.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">{profile.lastLogin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
            />
          </div>
          <Button 
            onClick={() => alert("Password change functionality would be implemented here")}
            className="w-full"
          >
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )

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

      {/* Profile Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-lg shadow-xl z-50 overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            <p className="text-muted-foreground">Manage your personal information and account settings</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(100%-80px)]">
          {/* Sidebar */}
          <div className="w-64 border-r p-4">
            <nav className="space-y-2">
              {[
                { id: "personal", name: "Personal Info", icon: User },
                { id: "account", name: "Account", icon: Shield },
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl">
                {activeTab === "personal" && renderPersonalInfo()}
                {activeTab === "account" && renderAccountInfo()}
              </div>
            </div>

            {/* Action Bar */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t bg-background p-6"
              >
                <div className="flex items-center justify-between max-w-2xl">
                  <div className="flex items-center space-x-2">
                    {saveStatus === "success" && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Changes saved successfully!</span>
                      </div>
                    )}
                    {saveStatus === "error" && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Failed to save changes</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Save className="h-4 w-4" />
                          </motion.div>
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
        </div>
      </motion.div>
    </>
  )
}