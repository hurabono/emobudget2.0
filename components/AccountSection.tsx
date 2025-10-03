import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../api";
import { AuthContext } from "../context/AuthContext"; // ✅ 추가

interface Account {
  accountId: string;
  nickname: string;
  currentBalance: number;
  availableBalance: number;
  mask: number;
}

const { width, height } = Dimensions.get("window");

const AccountSection = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useContext(AuthContext);                    // ✅ 추가
  const token = auth?.userToken;                           // ✅ 추가

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await apiClient.get<Account[]>("/accounts/selected", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined, // ✅ 핵심
          timeout: 15000,
        });
        console.log("📌 /accounts/selected 응답:", JSON.stringify(response.data, null, 2));
        setAccounts(response.data || []);
      } catch (err) {
        console.error("계좌 불러오기 실패:", err);
        // 실패 시엔 빈 배열 유지 → 디폴트 카드가 보이도록
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [token]); // ✅ 토큰 바뀌면 재조회

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 🔹 계좌가 하나도 없을 때: 디폴트 카드 + Link my account
  if (accounts.length === 0) {
    return (
      <View style={styles.container}>

        <LinearGradient
          colors={["#FBCBC9", "#93A9D1"]}
          start={{ x: 0, y: 2 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.accountType}>Plaid Checking</Text>

          <Text style={styles.cardTitle}>My account name</Text>
          <View style={styles.line} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.balance}>$ 00.00</Text>
            <Text style={styles.subBalance}>Available $00.00</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <TouchableOpacity onPress={() => router.push("/PlaidLinkScreen")}>
              <Text style={styles.linkText}>Link my account</Text>
            </TouchableOpacity>
            <Text style={styles.cardFooter}>Card 0000</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // 🔹 계좌가 있을 때: 기존 슬라이드 카드
  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.accountId}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <LinearGradient
            colors={["#FBCBC9", "#93A9D1"]}
            start={{ x: 0, y: 2 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.accountType}>Plaid Checking</Text>
            <Text style={styles.cardTitle}>{item.nickname}</Text>
            <View style={styles.line} />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.balance}>${item.currentBalance.toLocaleString()}</Text>
              <Text style={styles.subBalance}>Available ${item.availableBalance.toLocaleString()}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <TouchableOpacity onPress={() => router.push("/PlaidLinkScreen")}>
                <Text style={styles.linkText}>Link my account</Text>
              </TouchableOpacity>
              <Text style={styles.cardFooter}>Card {item.mask}</Text>
            </View>
          </LinearGradient>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  card: {
    width: width * 0.7,
    height: height * 0.25,
    marginLeft: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 4,
    justifyContent: "space-between",
  },
  accountType: { fontSize: 14, color: "#eee", alignSelf: "flex-end" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 8 },
  line: { height: 1, backgroundColor: "rgba(255,255,255,0.5)", marginVertical: 8 },
  balance: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 6 },
  subBalance: { fontSize: 16, color: "#eee", marginBottom: 10 },
  cardFooter: { fontSize: 14, color: "#ddd", alignSelf: "flex-end" },
  linkText: { fontSize: 14, color: "#fff", textDecorationLine: "underline" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { padding: 20, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#666" },
});

export default AccountSection;
