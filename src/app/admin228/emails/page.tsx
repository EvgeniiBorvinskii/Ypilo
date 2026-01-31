"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Mail,
  MailOpen,
  Inbox,
  Send,
  Trash2,
  Reply,
  RefreshCw,
  Search,
  Filter,
  Clock,
  User
} from "lucide-react"

interface Email {
  id: string
  from: string
  to: string
  subject: string
  body: string
  isRead: boolean
  isReplied: boolean
  replyBody?: string
  repliedAt?: string
  repliedBy?: string
  createdAt: string
}

export default function EmailManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const [mailbox, setMailbox] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      if (!(session?.user as any)?.isAdmin) {
        router.push("/")
      } else {
        fetchEmails()
      }
    }
  }, [status, session, router, mailbox])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/emails?mailbox=${mailbox}`)
      if (res.ok) {
        const data = await res.json()
        setEmails(data.emails)
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (emailId: string) => {
    try {
      const res = await fetch(`/api/emails/${emailId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true })
      })

      if (res.ok) {
        const data = await res.json()
        setEmails(emails.map(e => e.id === emailId ? data.email : e))
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(data.email)
        }
      }
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const sendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/emails/${selectedEmail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyBody: replyText })
      })

      if (res.ok) {
        const data = await res.json()
        setEmails(emails.map(e => e.id === selectedEmail.id ? data.email : e))
        setSelectedEmail(data.email)
        setReplyText("")
        setIsReplying(false)
        
        // Here you would also send the actual email via SMTP
        alert("Reply sent successfully!")
      }
    } catch (error) {
      console.error("Failed to send reply:", error)
      alert("Failed to send reply")
    } finally {
      setIsSending(false)
    }
  }

  const deleteEmail = async (emailId: string) => {
    if (!confirm("Are you sure you want to delete this email?")) return

    try {
      const res = await fetch(`/api/emails/${emailId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setEmails(emails.filter(e => e.id !== emailId))
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null)
        }
      }
    } catch (error) {
      console.error("Failed to delete email:", error)
    }
  }

  const selectEmail = (email: Email) => {
    setSelectedEmail(email)
    if (!email.isRead) {
      markAsRead(email.id)
    }
  }

  const filteredEmails = emails.filter(email =>
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = emails.filter(e => !e.isRead).length

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Email Management</h1>
          <p className="text-muted-foreground">Manage emails for admin@ypilo.com, support@ypilo.com, and order@ypilo.com</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-background border border-border rounded-xl p-6 space-y-4">
              <button
                onClick={fetchEmails}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              <div className="space-y-2">
                <button
                  onClick={() => setMailbox("all")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    mailbox === "all"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center">
                    <Inbox className="h-4 w-4 mr-2" />
                    All Emails
                  </div>
                  {mailbox === "all" && unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMailbox("admin@ypilo.com")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    mailbox === "admin@ypilo.com"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  admin@ypilo.com
                </button>

                <button
                  onClick={() => setMailbox("support@ypilo.com")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    mailbox === "support@ypilo.com"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  support@ypilo.com
                </button>

                <button
                  onClick={() => setMailbox("order@ypilo.com")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    mailbox === "order@ypilo.com"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  order@ypilo.com
                </button>
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="lg:col-span-1">
            <div className="bg-background border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {filteredEmails.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No emails found</p>
                  </div>
                ) : (
                  filteredEmails.map((email) => (
                    <button
                      key={email.id}
                      onClick={() => selectEmail(email)}
                      className={`w-full p-4 text-left transition-colors ${
                        selectedEmail?.id === email.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      } ${!email.isRead ? "font-semibold" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {email.isRead ? (
                            <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                          <span className="text-sm truncate">{email.from}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(email.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">To: {email.to}</p>
                      <p className="text-sm truncate mb-1">{email.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{email.body.substring(0, 60)}...</p>
                      {email.isReplied && (
                        <div className="mt-2 flex items-center text-xs text-green-600">
                          <Reply className="h-3 w-3 mr-1" />
                          Replied
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Email Detail */}
          <div className="lg:col-span-2">
            {selectedEmail ? (
              <div className="bg-background border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-semibold">{selectedEmail.subject}</h2>
                    <button
                      onClick={() => deleteEmail(selectedEmail.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">From:</span>
                      <span className="ml-2">{selectedEmail.from}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="font-medium">To:</span>
                      <span className="ml-2">{selectedEmail.to}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">
                        {new Date(selectedEmail.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold mb-3">Message:</h3>
                  <div className="prose prose-sm max-w-none mb-6 whitespace-pre-wrap">
                    {selectedEmail.body}
                  </div>

                  {selectedEmail.isReplied && selectedEmail.replyBody && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Your Reply:</h4>
                      <p className="text-sm whitespace-pre-wrap mb-2">{selectedEmail.replyBody}</p>
                      <p className="text-xs text-muted-foreground">
                        Replied by {selectedEmail.repliedBy} on {new Date(selectedEmail.repliedAt!).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {!isReplying && !selectedEmail.isReplied && (
                    <button
                      onClick={() => setIsReplying(true)}
                      className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply to Email
                    </button>
                  )}

                  {isReplying && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Reply:</h4>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={8}
                        placeholder="Type your reply here..."
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-vertical"
                      />
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={sendReply}
                          disabled={isSending || !replyText.trim()}
                          className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsReplying(false)
                            setReplyText("")
                          }}
                          className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-background border border-border rounded-xl p-12 text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Email Selected</h3>
                <p className="text-muted-foreground">Select an email from the list to view its contents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
