"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  FileText,
  Play,
  Clock,
  CheckCircle,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface HelpSupportProps {
  isOpen: boolean
  onClose: () => void
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface SupportArticle {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  icon: React.ComponentType<{ className?: string }>
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How do I export my analytics data?",
    answer: "You can export your data in multiple formats (CSV, PDF, Excel) by clicking the 'Export' button in any data table or chart. For bulk exports, visit the Reports section and generate a custom report with your desired data range and metrics.",
    category: "Data Export",
    helpful: 45
  },
  {
    id: "2",
    question: "Why are my real-time metrics not updating?",
    answer: "Real-time metrics update every 5 seconds by default. If they're not updating, check your internet connection and try clicking the refresh button. You can also pause/resume real-time updates using the controls in the Real-time dashboard section.",
    category: "Real-time Data",
    helpful: 32
  },
  {
    id: "3",
    question: "How do I set up custom notifications?",
    answer: "Go to Settings > Notifications to configure your notification preferences. You can set up alerts for specific metrics thresholds, schedule reports, and choose your preferred notification channels (email, desktop, SMS).",
    category: "Notifications",
    helpful: 28
  },
  {
    id: "4",
    question: "Can I customize the dashboard layout?",
    answer: "Yes! You can customize your dashboard by rearranging widgets, hiding/showing specific metrics cards, and adjusting the time ranges for charts. Your layout preferences are automatically saved to your profile.",
    category: "Customization",
    helpful: 19
  },
  {
    id: "5",
    question: "How do I create custom reports?",
    answer: "Navigate to the Reports section and click 'New Report'. Choose from our pre-built templates or create a custom report by selecting your desired metrics, date ranges, and visualization types. Reports can be scheduled for automatic generation.",
    category: "Reports",
    helpful: 37
  }
]

const supportArticles: SupportArticle[] = [
  {
    id: "1",
    title: "Getting Started with ADmyBRAND Insights",
    description: "Complete guide to setting up your analytics dashboard",
    category: "Getting Started",
    readTime: "5 min read",
    icon: Book
  },
  {
    id: "2",
    title: "Understanding Your Analytics Data",
    description: "Learn how to interpret metrics and KPIs effectively",
    category: "Analytics",
    readTime: "8 min read",
    icon: FileText
  },
  {
    id: "3",
    title: "Advanced Filtering and Search",
    description: "Master the search and filtering capabilities",
    category: "Features",
    readTime: "6 min read",
    icon: Search
  },
  {
    id: "4",
    title: "Setting Up Automated Reports",
    description: "Configure scheduled reports and notifications",
    category: "Automation",
    readTime: "10 min read",
    icon: Clock
  }
]

export function HelpSupport({ isOpen, onClose }: HelpSupportProps) {
  const [activeTab, setActiveTab] = useState("faq")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  })

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmitContact = () => {
    if (contactForm.subject && contactForm.message) {
      alert(`Support ticket submitted!\n\nSubject: ${contactForm.subject}\nPriority: ${contactForm.priority}\n\nOur team will respond within 24 hours.`)
      setContactForm({ subject: "", message: "", priority: "medium" })
    }
  }

  const renderFAQ = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search frequently asked questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {Array.from(new Set(faqData.map(faq => faq.category))).map(category => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-medium">{faq.question}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{faq.category}</Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{faq.helpful} helpful</span>
                    </div>
                  </div>
                </div>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedFAQ === faq.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="pt-0">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">Was this helpful?</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => alert("Thank you for your feedback!")}
                          >
                            👍 Yes
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => alert("We'll improve this answer. Thank you!")}
                          >
                            👎 No
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <Card className="p-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground">
            Try searching with different keywords or browse our documentation.
          </p>
        </Card>
      )}
    </div>
  )

  const renderDocumentation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <article.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Video Tutorials</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Dashboard Overview", duration: "3:45" },
              { title: "Creating Custom Reports", duration: "7:20" },
              { title: "Setting Up Notifications", duration: "4:15" },
              { title: "Data Export Options", duration: "5:30" }
            ].map((video, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                  <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{video.title}</p>
                  <p className="text-xs text-muted-foreground">{video.duration}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContact = () => (
    <div className="space-y-6">
      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4 dark:bg-blue-900/30">
              <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get instant help from our support team
            </p>
            <Button 
              className="w-full"
              onClick={() => alert("Live chat would open here. Available 24/7!")}
            >
              Start Chat
            </Button>
            <p className="text-xs text-green-600 mt-2">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Usually responds in 2-3 minutes
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4 dark:bg-green-900/30">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send us a detailed message
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('mailto:support@admybrand.com')}
            >
              Send Email
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              <Clock className="h-3 w-3 inline mr-1" />
              Response within 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-4 dark:bg-orange-900/30">
              <Phone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Speak with our experts directly
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => alert("Call us at: +1 (555) 123-HELP")}
            >
              Call Now
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              <Clock className="h-3 w-3 inline mr-1" />
              Mon-Fri, 9AM-6PM PST
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Support Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <Input
              placeholder="Brief description of your issue"
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <select
              value={contactForm.priority}
              onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="low">Low - General inquiry</option>
              <option value="medium">Medium - Need assistance</option>
              <option value="high">High - Issue affecting work</option>
              <option value="urgent">Urgent - Critical system issue</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <textarea
              placeholder="Please describe your issue in detail..."
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              rows={5}
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
            />
          </div>
          <Button 
            onClick={handleSubmitContact}
            className="w-full"
            disabled={!contactForm.subject || !contactForm.message}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Ticket
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

      {/* Help Modal */}
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
            <h2 className="text-2xl font-bold">Help & Support</h2>
            <p className="text-muted-foreground">Find answers and get assistance</p>
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
                { id: "faq", name: "FAQ", icon: HelpCircle },
                { id: "docs", name: "Documentation", icon: Book },
                { id: "contact", name: "Contact Support", icon: MessageCircle },
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
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl">
              {activeTab === "faq" && renderFAQ()}
              {activeTab === "docs" && renderDocumentation()}
              {activeTab === "contact" && renderContact()}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}