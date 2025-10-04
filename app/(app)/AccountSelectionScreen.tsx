import Screen from '@/components/Screen';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../../api"; // 기존 axios client
import GradientBackground from '../../components/GradientBackground';
import Button from "../../components/ui/Button";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 전체 계좌 불러오기
  const fetchAccounts = async () => {
    try {
      const res = await apiClient.get("/accounts/all");
      console.log("👉 /accounts/all 응답:", res.data);
      setAccounts(res.data || []);
    } catch (err) {
      console.error("계좌 불러오기 실패", err);
    } finally {
      setLoading(false);
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
      // 서버는 {id, nickname} 형태 기대  변환
      const payload = selectedAccounts.map((acc) => ({
        id: acc.accountId,
        nickname: acc.nickname || acc.name,
      }));
      await apiClient.post("/accounts/save", payload);
      console.log("✅ 계좌 저장 성공");
      router.replace({ pathname: "/HomeScreen", params: { t: String(Date.now()) } });
    } catch (err) {
      console.error("❌ 계좌 저장 실패", err);
    }
  };

  return (
    <GradientBackground>
      <Screen>
        <View style={styles.container}>
          <Text className='font-flex tracking-widest' style={styles.title}>Select Account</Text>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <FlatList
              data={accounts}
              keyExtractor={(item) => item.accountId}
              ListEmptyComponent={
                <Text style={styles.emptyText}>연동 가능한 계좌가 없습니다.</Text>
              }
              renderItem={({ item }) => {
                const checked = !!selectedAccounts.find(
                  (a) => a.accountId === item.accountId
                );
                return (
                  <TouchableOpacity
                    onPress={() => toggleSelect(item)}
                    style={styles.row}
                    activeOpacity={0.8}
                  >
                    {/* 체크박스 UI */}
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked ? <Text style={styles.checkmark}>✓</Text> : null}
                    </View>

                    {/* 계좌 정보 */}
                    <View style={{ flex: 1 }}>
                      <Text className='font-flex tracking-wider text-brand-dim' style={styles.accountName}>{item.name}</Text>
                      <Text className='font-flex tracking-wider text-brand-ink' style={styles.accountSub}>
                        {item.subtype || "N/A"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

          <View style={{ marginTop: 16 }}>
            <Button
              label={`Save my account ${selectedAccounts.length ? ` (${selectedAccounts.length})` : ""}`}
              onPress={handleContinue}
            />
          </View>
        </View>
      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "transparent", flex: 1 },
  title: {
    fontSize: 25,          
    fontWeight: "bold",
    color: "#fff", 
    textAlign: "left",
    marginBottom: 25,
    textShadowColor: "rgba(255, 255, 255, 0.9)", 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,      
  },
  loading: {
    flex: 1,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { color: "#eee", textAlign: "center", paddingVertical: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FBCBC9",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#FBCBC9",
    borderColor: "#FBCBC9",
  },
  checkmark: {
    color: "#3b3b3b",
    fontWeight: "900",
    fontSize: 14,
    lineHeight: 14,
  },
  accountName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  accountSub: { color: "#ddd", fontSize: 12, marginTop: 2 },
  separator: { height: 10 },
});

export default AccountSelectionScreen;
