import { Key, Check, X } from "lucide-react";
import { useState } from "react";

export function OfficeCodeForm({ onBack }: { onBack: () => void }) {
  const [code, setCode] = useState("");
  const [valid, setValid] = useState<"valid" | "invalid" | null>(null);

  const validateCode = (value: string) => {
    setCode(value);
    if (!value) return setValid(null);
    if (value.length >= 6) setValid("valid");
    else setValid("invalid");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-8">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-xl w-full">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="mb-3 text-xl font-semibold text-gray-700">본사 코드 입력</h1>
          <p className="text-gray-500">
            관리자로부터 받은 본사 코드를 입력하세요
          </p>
        </div>

        <label className="block mb-2 text-gray-600">본사 코드</label>
        <div className="relative">
          <input
            className="w-full px-5 py-4 border-2 rounded-xl text-lg"
            style={{
              borderColor: valid === "valid" ? "#10B981" : valid === "invalid" ? "#EF4444" : "#E5E7EB",
            }}
            placeholder="본사 코드를 입력하세요"
            value={code}
            onChange={(e) => validateCode(e.target.value)}
          />

          {valid && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              {valid === "valid" ? (
                <Check className="text-green-500 bg-green-100 rounded-full p-1" />
              ) : (
                <X className="text-red-500 bg-red-100 rounded-full p-1" />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button onClick={onBack} className="px-8 py-3 border rounded-xl text-gray-600">
            뒤로가기
          </button>
          <button
            disabled={valid !== "valid"}
            className="px-8 py-3 bg-yellow-500 text-white rounded-xl disabled:opacity-50"
            onClick={() => alert("참여 완료 (API 미연결)")}
          >
            참여하기
          </button>
        </div>

      </div>
    </div>
  );
}