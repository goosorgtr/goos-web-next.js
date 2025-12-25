'use client'

import { useState } from 'react'
import { Search, Send, Paperclip, Plus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock data
interface Message {
  id: string
  sender: 'veli' | 'admin'
  senderName: string
  content: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  veliName: string
  studentName: string
  studentClass: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    veliName: 'Ahmet Yılmaz',
    studentName: 'Ayşe Yılmaz',
    studentClass: '8-A',
    lastMessage: 'Matematik dersinde sorun var.',
    lastMessageTime: '10:45',
    unreadCount: 1,
    isOnline: true
  },
  {
    id: '2',
    veliName: 'Fatma Demir',
    studentName: 'Ali Demir',
    studentClass: '5-B',
    lastMessage: 'Teşekkürler bilgi için.',
    lastMessageTime: '09:30',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    veliName: 'Mustafa Kaya',
    studentName: 'Elif Kaya',
    studentClass: '7-C',
    lastMessage: 'Devamsızlık konusunda konuşmak istiyorum.',
    lastMessageTime: 'Dün',
    unreadCount: 2,
    isOnline: true
  }
]

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      sender: 'veli',
      senderName: 'Ahmet Yılmaz',
      content: 'Merhaba, çocuğumun matematik dersinde sorun yaşıyor. Son sınavda başarısız oldu.',
      timestamp: '09:15',
      isRead: true
    },
    {
      id: '2',
      sender: 'admin',
      senderName: 'Yönetim',
      content: 'Merhaba Ahmet Bey, durumu inceliyoruz. Öğretmenle görüşüp size geri dönüş yapacağım.',
      timestamp: '09:30',
      isRead: true
    },
    {
      id: '3',
      sender: 'veli',
      senderName: 'Ahmet Yılmaz',
      content: 'Teşekkür ederim, bekliyorum.',
      timestamp: '10:45',
      isRead: true
    }
  ],
  '2': [
    {
      id: '1',
      sender: 'veli',
      senderName: 'Fatma Demir',
      content: 'Çocuğumun ders durumu nasıl gidiyor?',
      timestamp: '08:00',
      isRead: true
    },
    {
      id: '2',
      sender: 'admin',
      senderName: 'Yönetim',
      content: 'Ali\'nin dersleri çok iyi gidiyor. Ödevlerini düzenli yapıyor.',
      timestamp: '09:30',
      isRead: true
    }
  ],
  '3': [
    {
      id: '1',
      sender: 'veli',
      senderName: 'Mustafa Kaya',
      content: 'Elif\'in devamsızlık durumu hakkında konuşmak istiyorum.',
      timestamp: 'Dün',
      isRead: false
    }
  ]
}

// Mock öğretmen konuşmaları
const MOCK_TEACHER_CONVERSATIONS: Conversation[] = [
  {
    id: 't1',
    veliName: 'Mehmet Yılmaz (Öğretmen)',
    studentName: 'Matematik Öğretmeni',
    studentClass: 'Aktif',
    lastMessage: 'Anladım, veliye bilgi vereceğim.',
    lastMessageTime: '11:20',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 't2',
    veliName: 'Zeynep Aydın (Öğretmen)',
    studentName: 'Türkçe Öğretmeni',
    studentClass: 'Aktif',
    lastMessage: 'Öğrenci durumu çok iyi.',
    lastMessageTime: '10:15',
    unreadCount: 1,
    isOnline: false
  },
  {
    id: 't3',
    veliName: 'Can Öztürk (Öğretmen)',
    studentName: 'İngilizce Öğretmeni',
    studentClass: 'Aktif',
    lastMessage: 'Ek ders gerekli.',
    lastMessageTime: 'Dün',
    unreadCount: 0,
    isOnline: true
  }
]

const MOCK_TEACHER_MESSAGES: Record<string, Message[]> = {
  't1': [
    {
      id: '1',
      sender: 'admin',
      senderName: 'Yönetim',
      content: 'Merhaba Mehmet Bey, Ahmet Yılmaz (Ayşe\'nin velisi) matematik dersinde sorun olduğunu söylüyor. Durumu açıklayabilir misiniz?',
      timestamp: '10:00',
      isRead: true
    },
    {
      id: '2',
      sender: 'veli',
      senderName: 'Mehmet Yılmaz',
      content: 'Ayşe son sınavda başarısız oldu ama genel olarak dersleri iyi takip ediyor. Sadece son konuda zorlandı. Ek çalışma yapmasını öneriyorum.',
      timestamp: '10:30',
      isRead: true
    },
    {
      id: '3',
      sender: 'admin',
      senderName: 'Yönetim',
      content: 'Anladım, veliye bilgi vereceğim. Teşekkürler.',
      timestamp: '11:20',
      isRead: true
    }
  ],
  't2': [
    {
      id: '1',
      sender: 'admin',
      senderName: 'Yönetim',
      content: 'Ali Demir\'in velisi öğrencinin Türkçe dersi durumunu soruyor.',
      timestamp: '09:00',
      isRead: true
    },
    {
      id: '2',
      sender: 'veli',
      senderName: 'Zeynep Aydın',
      content: 'Ali çok başarılı bir öğrenci. Türkçe dersi hiç sorunu yok. Veliye endişelenmemesini söyleyebilirsiniz.',
      timestamp: '10:15',
      isRead: false
    }
  ],
  't3': [
    {
      id: '1',
      sender: 'admin',
      senderName: 'Yönetim',
      content: 'İngilizce dersi genel durumu nasıl?',
      timestamp: 'Dün',
      isRead: true
    },
    {
      id: '2',
      sender: 'veli',
      senderName: 'Can Öztürk',
      content: 'Genel olarak iyi ama bazı öğrencilere ek ders gerekli.',
      timestamp: 'Dün',
      isRead: true
    }
  ]
}

export default function MesajlarPage() {
  const [activeTab, setActiveTab] = useState<'veliler' | 'ogretmenler'>('veliler')
  const [selectedConversation, setSelectedConversation] = useState<string>('1')
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const conversations = activeTab === 'veliler' ? MOCK_CONVERSATIONS : MOCK_TEACHER_CONVERSATIONS
  const messagesData = activeTab === 'veliler' ? MOCK_MESSAGES : MOCK_TEACHER_MESSAGES
  
  const selectedMessages = messagesData[selectedConversation] || []
  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sol Taraf - Konuşma Listesi */}
      <div className="flex w-80 flex-col rounded-xl border bg-white shadow-sm">
        {/* Header */}
        <div className="border-b p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mesajlar</h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => {
                setActiveTab('veliler')
                setSelectedConversation('1')
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === 'veliler'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Veliler
            </button>
            <button
              onClick={() => {
                setActiveTab('ogretmenler')
                setSelectedConversation('t1')
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === 'ogretmenler'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Öğretmenler
            </button>
          </div>
          
          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Arama yapın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </div>
        </div>

        {/* Konuşma Listesi */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`flex w-full items-start gap-3 border-b p-4 text-left transition hover:bg-gray-50 ${
                selectedConversation === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <span className="text-sm font-semibold">
                    {conv.veliName.charAt(0)}
                  </span>
                </div>
                {conv.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>

              {/* İçerik */}
              <div className="flex-1 overflow-hidden">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{conv.veliName}</h3>
                  <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                </div>
                <p className="mb-1 text-xs text-muted-foreground">
                  {conv.studentName} - {conv.studentClass}
                </p>
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm text-muted-foreground">
                    {conv.lastMessage}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sağ Taraf - Mesaj Detayı */}
      <div className="flex flex-1 flex-col rounded-xl border bg-white shadow-sm">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    <span className="text-sm font-semibold">
                      {selectedConv.veliName.charAt(0)}
                    </span>
                  </div>
                  {selectedConv.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConv.veliName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedConv.studentName} - {selectedConv.studentClass}
                  </p>
                </div>
              </div>
              
              <button className="rounded-lg p-2 hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Mesajlar */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <div className="space-y-4">
                {/* Bilgi Mesajı */}
                <div className="flex justify-center">
                  <div className="rounded-lg bg-blue-100 px-4 py-2 text-center">
                    <p className="text-xs text-blue-800">
                      <strong>{selectedConv.veliName}</strong> ile mesajlaşıyorsunuz
                      {activeTab === 'ogretmenler' && (
                        <span className="ml-1">(Öğretmen iletişimi)</span>
                      )}
                    </p>
                  </div>
                </div>

                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-lg px-4 py-2 ${
                        message.sender === 'admin'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {message.sender === 'veli' && (
                        <p className="mb-1 text-xs font-semibold opacity-70">
                          {message.senderName}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                        {message.sender === 'admin' && (
                          <span className="text-xs">
                            {message.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Mesaj Gönderme Alanı */}
            <div className="border-t bg-white p-4">
                <div className="flex items-end gap-2">
                <button className="rounded-lg p-2 hover:bg-gray-100">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      activeTab === 'veliler'
                        ? 'Veliye mesaj yazın...'
                        : 'Öğretmene mesaj yazın...'
                    }
                    className="w-full resize-none rounded-lg border bg-gray-50 px-4 py-2 text-sm outline-none focus:border-primary focus:bg-white"
                    rows={1}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activeTab === 'veliler' ? 'Veliye gönderilecek' : 'Öğretmene gönderilecek'}
                  </p>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Bir konuşma seçin
          </div>
        )}
      </div>
    </div>
  )
}
