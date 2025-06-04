import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center">
              <div className="text-[#a2abb3] mb-8">
                <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.448M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-white mb-4">Página não encontrada</h2>
              <p className="text-[#a2abb3] mb-8 max-w-md">
                A página que você está procurando não existe ou foi movida para outro local.
              </p>
              
              <div className="flex gap-4">
                <Link 
                  href="/"
                  className="bg-[#2884e6] text-white px-6 py-3 rounded-lg hover:bg-[#2672cc] transition-colors"
                >
                  Voltar ao Dashboard
                </Link>
                <Link 
                  href="/channels"
                  className="bg-[#2c3135] text-[#a2abb3] px-6 py-3 rounded-lg hover:bg-[#3c4147] transition-colors"
                >
                  Ver Canais
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 