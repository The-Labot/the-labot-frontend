import { useEffect, useState } from "react";
import type { WorkerListItem } from "./Worker";
import { getWorkerList } from "../api/workerApi";
import WorkerTable from "./WorkerTable";
import WorkerDetailModal from "./WorkerDetailModal";
//import "./WorkerListPage.css";

export default function WorkerListPage() {
  const [workerList, setWorkerList] = useState<WorkerListItem[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const siteId = 1; // 선택된 현장 ID (나중에 동적 변경)
      const list  = await getWorkerList(siteId);
      setWorkerList(list);
    } catch (error) {
      console.error("근로자 목록 조회 실패:", error);
    }
  };

  return (
    <div className="worker-list-page">
      <WorkerTable      />

        {selectedWorkerId && (
          <WorkerDetailModal
            workerId={selectedWorkerId}
            siteId={Number()}   // <-- 추가
            onClose={() => setSelectedWorkerId(null)}
          />
          )}
    </div>
  );
}
