import type { Store } from '@/lib/types'

export default function StoreInfo({ store }: { store: Store }) {
  return (
    <div className="card-light p-5">
      <div className="flex items-center gap-3 mb-4">
        {store.logo_url ? (
          <img src={store.logo_url} alt={store.name} className="w-12 h-12 rounded-xl object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 text-lg font-bold">
            {store.name.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="font-bold text-gray-900 text-lg leading-tight">{store.name}</h2>
          {store.description && (
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{store.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {store.address && (
          <div className="flex items-start gap-2.5 text-sm">
            <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-gray-600">{store.address}</span>
          </div>
        )}
        {store.phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <a href={`tel:${store.phone}`} className="text-gray-600 hover:text-blue-500 transition-colors">
              {store.phone}
            </a>
          </div>
        )}
        {store.hours && (
          <div className="flex items-center gap-2.5 text-sm">
            <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-gray-600">{store.hours}</span>
          </div>
        )}
      </div>
    </div>
  )
}
