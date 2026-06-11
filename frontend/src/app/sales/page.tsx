export default function SalesPage() {
  return <UnderConstruction title="Sales Report" />;
}

function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="text-blue-400">
          <polyline points="4,17 9,12 13,15 20,7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-400 text-sm mb-1">This page is under construction</p>
      <p className="text-gray-300 text-xs">Coming soon...</p>
    </div>
  );
}
