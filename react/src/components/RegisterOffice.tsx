import { Plus } from "lucide-react";
import { useState } from "react";

export function NewOfficeForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    representative: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("새 본사 등록:", form);
    alert("등록 완료 (API 나중에 연결 예정)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50">
      <div className="w-full max-w-4xl px-8">
        <div className="bg-white p-10 rounded-3xl shadow-lg">

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-700">새로운 본사 등록</h1>
            <p className="text-gray-500">본사 정보를 입력하여 등록을 완료하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 text-gray-600">본사명 *</label>
                <input
                  className="w-full px-4 py-3 border-2 rounded-xl"
                  placeholder="본사명을 입력하세요"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-600">본사 코드 *</label>
                <input
                  className="w-full px-4 py-3 border-2 rounded-xl"
                  placeholder="고유 코드 입력"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
                <p className="text-gray-400 mt-1 text-sm">
                  다른 관리자가 참여할 때 사용할 코드입니다.
                </p>
              </div>

              <div>
                <label className="block mb-2 text-gray-600">대표자명 *</label>
                <input
                  className="w-full px-4 py-3 border-2 rounded-xl"
                  placeholder="대표자명을 입력하세요"
                  value={form.representative}
                  onChange={(e) => setForm({ ...form, representative: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-600">전화번호 *</label>
                <input
                  className="w-full px-4 py-3 border-2 rounded-xl"
                  placeholder="전화번호 입력"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-600">주소 *</label>
                <input
                  className="w-full px-4 py-3 border-2 rounded-xl"
                  placeholder="주소 입력"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="px-8 py-3 border rounded-xl text-gray-600"
              >
                뒤로가기
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-blue-500 text-white rounded-xl"
              >
                등록하기
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}