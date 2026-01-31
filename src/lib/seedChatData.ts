// Seed data for testing admin chat
'use client'

import { RealDialog, RealMessage } from './chatData'

export const seedChatData = () => {
  if (typeof window === 'undefined') return

  const existingData = localStorage.getItem('bs_chat_dialogs')
  if (existingData && JSON.parse(existingData).length > 0) {
    console.log('Chat data already exists, skipping seed')
    return
  }

  const sampleMessages: RealMessage[] = [
    {
      id: 'msg1',
      text: 'Hello! I need help with my account',
      sender: 'user',
      timestamp: Date.now() - 300000, // 5 minutes ago
      userId: 'user1',
      userName: 'John Doe',
      isRead: false
    },
    {
      id: 'msg2', 
      text: 'Hi John! I can help you with that. What specific issue are you having?',
      sender: 'admin',
      timestamp: Date.now() - 240000, // 4 minutes ago
      isRead: true
    },
    {
      id: 'msg3',
      text: 'I cant access my dashboard after the recent update',
      sender: 'user', 
      timestamp: Date.now() - 180000, // 3 minutes ago
      userId: 'user1',
      userName: 'John Doe',
      isRead: false
    }
  ]

  const sampleMessages2: RealMessage[] = [
    {
      id: 'msg4',
      text: 'Hi, is this the support chat?',
      sender: 'user',
      timestamp: Date.now() - 600000, // 10 minutes ago
      userId: 'user2', 
      userName: 'Sarah Wilson',
      isRead: true
    },
    {
      id: 'msg5',
      text: 'Yes, this is support. How can I help you today?',
      sender: 'admin',
      timestamp: Date.now() - 540000, // 9 minutes ago
      isRead: true
    }
  ]

  const sampleDialogs: RealDialog[] = [
    {
      id: 'dialog1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john.doe@email.com',
      lastMessage: 'I cant access my dashboard after the recent update',
      timestamp: Date.now() - 180000,
      isActive: true,
      unreadCount: 2,
      messages: sampleMessages,
      userInfo: {
        browser: 'Chrome',
        os: 'Windows 10',
        device: 'Desktop',
        location: 'New York, US',
        firstVisit: Date.now() - 86400000 // 1 day ago
      }
    },
    {
      id: 'dialog2', 
      userId: 'user2',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@email.com', 
      lastMessage: 'Yes, this is support. How can I help you today?',
      timestamp: Date.now() - 540000,
      isActive: false,
      unreadCount: 0,
      messages: sampleMessages2,
      userInfo: {
        browser: 'Firefox',
        os: 'macOS',
        device: 'MacBook Pro',
        location: 'Toronto, CA',
        firstVisit: Date.now() - 172800000 // 2 days ago
      }
    }
  ]

  localStorage.setItem('bs_chat_dialogs', JSON.stringify(sampleDialogs))
  console.log('Sample chat data seeded successfully')
}