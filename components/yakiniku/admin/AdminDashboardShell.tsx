'use client'
import { useState } from 'react'
import Link from 'next/link'
import AdminOrderDashboard from './AdminOrderDashboard'
import KitchenOrderBoard from './KitchenOrderBoard'
import DrinkOrderBoard from './DrinkOrderBoard'
import AiRecommendAdminPanel from './AiRecommendAdminPanel'
import StayAnalyticsPanel from '@/components/yakiniku/StayAnalyticsPanel'
import BehaviorAnalyticsPanel from '@/components/yakiniku/BehaviorAnalyticsPanel'
import AdDeliveryDashboard from '@/components/yakiniku/AdDeliveryDashboard'
import CrmDashboard from '@/components/yakiniku/CrmDashboard'

type TabId = 'orders' | 'kitchen' | 'drink' | 'ai' | 'stay' | 'behavior' | 'ads' | 'crm'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'orders',   label: '注文管理',  emoji: '📋' },
  { id: 'kitchen',  label: '厨房状況',  emoji: '🍳' },
  { id: 'drink',    label: 'ドリンク場', emoji: '🍺' },
  { id: 'ai',       label: 'AIレコメンド', emoji: '✨' },
  { id: 'stay',     label: '滞在分析',  emoji: '⏱' },
  { id: 'behavior', label: '行動分析',  emoji: '📊' },
  { id: 'ads',      label: '広告配信',  emoji: '📢' },
  { id: 'crm',      label: 'CRM',      emoji: '👥' },
]

export default function AdminDashboardShell() {
  const [activeTab, setActiveTab] = useState<TabId>('orders')

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#0d0d0d] border-b border-white/10 px-6 py-3 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <h1 className="text-lg font-black text-white leading-none">焼肉 白雲台</h1>
            <p className="text-xs text-gray-500 mt-0.5">SMART CHARGER × NFC × 席OS</p>
          </div>
        </div>
        <div className="ml-auto">
          <Link href="/yakiniku"
            className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-sm font-bold transition-colors">
            お客様画面
          </Link>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="bg-[#0d0d0d] border-b border-white/10 px-4 shrink-0 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5"
              style={{
                background: activeTab === tab.id ? '#ea580c' : '#1a1a1a',
                color: activeTab === tab.id ? '#fff' : '#9ca3af',
              }}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'orders'   && <AdminOrderContentWrapper />}
        {activeTab === 'kitchen'  && <KitchenContentWrapper />}
        {activeTab === 'drink'    && <DrinkContentWrapper />}
        {activeTab === 'ai'       && <TabWrapper title="AIレコメンド管理"><AiRecommendAdminPanel /></TabWrapper>}
        {activeTab === 'stay'     && <TabWrapper title="滞在分析"><StayAnalyticsPanel /></TabWrapper>}
        {activeTab === 'behavior' && <TabWrapper title="行動分析"><BehaviorAnalyticsPanel /></TabWrapper>}
        {activeTab === 'ads'      && <TabWrapper title="広告配信管理"><AdDeliveryDashboard /></TabWrapper>}
        {activeTab === 'crm'      && <TabWrapper title="CRM（顧客管理）"><CrmDashboard /></TabWrapper>}
      </div>
    </div>
  )
}

function TabWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-black text-white mb-5">{title}</h2>
      {children}
    </div>
  )
}

function AdminOrderContentWrapper() {
  return <AdminOrderDashboard embedded />
}

function KitchenContentWrapper() {
  return <KitchenOrderBoard embedded />
}

function DrinkContentWrapper() {
  return <DrinkOrderBoard embedded />
}
