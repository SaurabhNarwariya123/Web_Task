export default function CustomersPage() {
  return <UnderConstruction title="Customers" />;
}

function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="text-blue-400">
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-400 text-sm mb-1">This page is under construction</p>
      <p className="text-gray-300 text-xs">Coming soon...</p>
    </div>
  );
}
