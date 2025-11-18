// src/components/NewOfficeForm.tsx
import { Plus } from "lucide-react";
import { useState } from "react";

interface NewOfficeFormProps {
  onBack: () => void;
  onComplete?: () => void; // 등록 후 대시보드 이동을 위한 optional
}

export function NewOfficeForm({ onBack, onComplete }: NewOfficeFormProps) {
  const [officeName, setOfficeName] = useState("");
  const [officeCode, setOfficeCode] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("신규 본사 등록:", {
      officeName,
      officeCode,
      representativeName,
      phone,
      address,
    });

    // 🔥 실제 API는 나중에 연결
    alert("본사 등록 완료!");

    onComplete?.(); // 대시보드 이동 수행
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div className="w-full max-w-4xl px-8">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#DBEAFE" }}
            >
              <Plus className="w-8 h-8" style={{ color: "#3B82F6" }} />
            </div>
            <h1 className="mb-3" style={{ color: "#1F2937" }}>
              새로운 본사 등록
            </h1>
            <p style={{ color: "#6B7280", fontSize: "16px" }}>
              본사 정보를 입력하여 등록을 완료하세요
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Office Name */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">
                  본사명 *
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2"
                  style={{ borderColor: "#E5E7EB" }}
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  placeholder="본사명을 입력하세요"
                  required
                />
              </div>

              {/* Office Code */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">
                  본사 코드 *
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2"
                  style={{ borderColor: "#E5E7EB" }}
                  value={officeCode}
                  onChange={(e) => setOfficeCode(e.target.value)}
                  placeholder="고유 코드를 생성하세요"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  다른 관리자가 참여할 때 사용하는 코드입니다.
                </p>
              </div>

              {/* Representative */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">
                  대표자명 *
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2"
                  style={{ borderColor: "#E5E7EB" }}
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  placeholder="대표자명을 입력하세요"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">
                  전화번호 *
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2"
                  style={{ borderColor: "#E5E7EB" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="전화번호를 입력하세요"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-700 text-sm">
                  주소 *
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2"
                  style={{ borderColor: "#E5E7EB" }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="주소를 입력하세요"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="px-8 py-4 rounded-xl border-2 hover:opacity-70"
                style={{ borderColor: "#D1D5DB", color: "#6B7280" }}
              >
                뒤로가기
              </button>

              <button
                type="submit"
                className="px-8 py-4 rounded-xl text-white hover:opacity-90"
                style={{ backgroundColor: "#3B82F6" }}
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