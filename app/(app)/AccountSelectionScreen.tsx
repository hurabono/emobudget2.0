import React, { useEffect, useState } from "react";
import apiClient from "../../api"; // 기존 axios client
import { useRouter } from "expo-router";

interface Account {
  accountId: string;
  name: string;
  mask?: string;
  subtype?: string;
  currentBalance?: number;
  availableBalance?: number;
  nickname?: string;
}


const AccountSelectionScreen = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  const router = useRouter();

  // 전체 계좌 불러오기
  const fetchAccounts = async () => {
    try {
      const res = await apiClient.get("/accounts/all");
      console.log("👉 /accounts/all 응답:", res.data);
      setAccounts(res.data);
    } catch (err) {
      console.error("계좌 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 체크박스 토글
  const toggleSelect = (account: Account) => {
    const alreadySelected = selectedAccounts.find(
      (a) => a.accountId === account.accountId
    );
    if (alreadySelected) {
      setSelectedAccounts((prev) =>
        prev.filter((a) => a.accountId !== account.accountId)
      );
    } else {
      setSelectedAccounts((prev) => [...prev, account]);
    }
  };

  // 선택한 계좌 저장
  const handleContinue = async () => {
    try {
      // ✅ 서버는 {id, nickname} 형태 기대 → 변환
      const payload = selectedAccounts.map((acc) => ({
        id: acc.accountId,
        nickname: acc.nickname || acc.name,
      }));
      await apiClient.post("/accounts/save", payload);
      console.log("✅ 계좌 저장 성공");
      router.push("/HomeScreen");
    } catch (err) {
      console.error("❌ 계좌 저장 실패", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>계좌 선택</h2>
      {accounts.map((acc) => (
        <div key={acc.accountId}>
          <label>
            <input
              type="checkbox"
              checked={!!selectedAccounts.find((a) => a.accountId === acc.accountId)}
              onChange={() => toggleSelect(acc)}
            />
            {acc.name} • {acc.subtype || "N/A"}
          </label>
        </div>
      ))}
      <button onClick={handleContinue} style={{ marginTop: 20 }}>
        저장하고 계속하기
      </button>
    </div>
  );
};

export default AccountSelectionScreen;
