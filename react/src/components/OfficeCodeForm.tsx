// src/components/OfficeCodeForm.tsx
import { Key } from "lucide-react";
import { useState } from "react";

interface OfficeCodeFormProps {
  onBack: () => void;
  onComplete?: () => void; // 참여 후 이동
}

export function OfficeCodeForm({ onBack, onComplete }: OfficeCodeFormProps) {
  const [officeCode, setOfficeCode] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleCodeChange = (value: string) => {
    setOfficeCode(value);

    if (value.length === 0) return setIsValid(null);

    // 아직 API 없음 → Mock validation
    if (value.length >= 6) setIsValid(true);
    else setIsValid(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValid) {
      console.log("본사 참여 코드:", officeCode);
      alert("본사 참여 완료!");
      onComplete?.();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div className="w-full max-w-2xl px-8">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <Key className="w-8 h-8" style={{ color: "#F59E0B" }} />
            </div>
            <h1 className="mb-3" style={{ color: "#1F2937" }}>
              본사 코드 입력
            </h1>
            <p className="text-gray-500">관리자로부터 받은 본사 코드를 입력하세요</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-700 text-sm block mb-3">본사 코드</label>
              <input
                className="w-full px-6 py-4 rounded-xl border-2 text-lg focus:outline-none"
                style={{
                  borderColor:
                    isValid === null
                      ? "#E5E7EB"
                      : isValid
                        ? "#10B981"
                        : "#EF4444",
                }}
                placeholder="본사 코드를 입력하세요"
                value={officeCode}
                onChange={(e) => handleCodeChange(e.target.value)}
              />

              {/* Validation Messages */}
              {isValid === false && (
                <p className="mt-2 text-sm text-red-500">유효하지 않은 코드입니다.</p>
              )}
              {isValid === true && (
                <p className="mt-2 text-sm text-green-500">사용 가능한 코드입니다!</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
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
                disabled={!isValid}
                className="px-8 py-4 rounded-xl text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#F59E0B" }}
              >
                참여하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}