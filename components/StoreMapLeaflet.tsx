'use client'

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'
import { useState } from 'react'
import type { Store } from '@/lib/types'

const DARK_MAP_ID = 'vexii-dark'

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#020c1b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#020c1b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#2d5a8e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#0d1f3c' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1e3c72' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#3b82f6' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#0f2545' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1e3c72' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#060f1e' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#60a5fa' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#010814' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1e3c72' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#060f1e' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#2d5a8e' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#060f1e' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e3c72' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#1e3c72' }] },
]

function StoreMarker({ store, onSelect }: { store: Store; onSelect: (s: Store) => void }) {
  const [ref, marker] = useAdvancedMarkerRef()
  return (
    <AdvancedMarker
      ref={ref}
      position={{ lat: store.lat!, lng: store.lng! }}
      onClick={() => onSelect(store)}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
          border: '2px solid rgba(147,197,253,0.5)',
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          boxShadow: '0 4px 16px rgba(59,130,246,0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            background: '#bfdbfe',
            borderRadius: '50%',
          }}
        />
      </div>
    </AdvancedMarker>
  )
}

function StoreInfoWindow({ store, onClose }: { store: Store; onClose: () => void }) {
  return (
    <InfoWindow
      position={{ lat: store.lat!, lng: store.lng! }}
      onCloseClick={onClose}
      pixelOffset={[0, -42]}
    >
      <div style={{
        background: '#0d1f3c',
        border: '1px solid rgba(59,130,246,0.25)',
        borderRadius: 12,
        padding: '12px 14px',
        minWidth: 180,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <p style={{ color: '#bfdbfe', fontWeight: 600, fontSize: 13, margin: '0 0 4px' }}>
          {store.name}
        </p>
        {store.description && (
          <p style={{ color: '#3b82f6', fontSize: 11, margin: '0 0 4px' }}>{store.description}</p>
        )}
        {store.address && (
          <p style={{ color: '#2d5a8e', fontSize: 11, margin: '0 0 4px' }}>{store.address}</p>
        )}
        {store.hours && (
          <p style={{ color: '#1e3c72', fontSize: 11, margin: 0 }}>{store.hours}</p>
        )}
      </div>
    </InfoWindow>
  )
}

export default function StoreMapLeaflet({ stores }: { stores: Store[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const mapped = stores.filter((s) => s.lat && s.lng)
  const [selected, setSelected] = useState<Store | null>(null)

  const center = mapped.length > 0
    ? { lat: mapped.reduce((s, m) => s + m.lat!, 0) / mapped.length, lng: mapped.reduce((s, m) => s + m.lng!, 0) / mapped.length }
    : { lat: 35.6812, lng: 139.7671 }

  if (!apiKey || apiKey === 'your-google-maps-api-key') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#060f1e] gap-4">
        <svg className="w-12 h-12 text-[#1e3c72]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
        </svg>
        <div className="text-center">
          <p className="text-[#2d5a8e] text-sm font-semibold mb-1">Google Maps API キーが未設定です</p>
          <p className="text-[#1e3c72] text-xs">.env.local の NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定してください</p>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={mapped.length === 1 ? 14 : 11}
        mapId={DARK_MAP_ID}
        styles={MAP_STYLES}
        disableDefaultUI={false}
        gestureHandling="greedy"
        className="w-full h-full"
      >
        {mapped.map((store) => (
          <StoreMarker key={store.id} store={store} onSelect={setSelected} />
        ))}
        {selected && (
          <StoreInfoWindow store={selected} onClose={() => setSelected(null)} />
        )}
      </Map>
    </APIProvider>
  )
}
