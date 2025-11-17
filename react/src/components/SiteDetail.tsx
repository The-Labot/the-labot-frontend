// src/components/SiteDetail.tsx
interface SiteDetailProps {
  siteName: string;
  onBack: () => void;
}

export function SiteDetail({ siteName, onBack }: SiteDetailProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 rounded-lg border hover:bg-gray-50"
          style={{ borderColor: '#D1D5DB', color: '#374151' }}
        >
          ← 현장 목록으로
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
            {siteName}
          </h1>
          <p style={{ color: '#6B7280' }}>
            현장 상세 대시보드는 나중에 디자인 확정되면 여기서 구현할 거야.  
            지금은 구조만 맞춰두고, 나중에 패널/그래프/테이블 넣으면 된다.
          </p>
        </div>
      </div>
    </div>
  );
}