import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import apiClient from "../api";
import { AuthContext } from "../context/AuthContext";

interface Account {
  accountId: string;
  nickname: string;
  currentBalance: number;
  availableBalance: number;
  mask: number;
}

const AccountSection = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const listRef = useRef<FlatList<Account>>(null);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const router = useRouter();
  const auth = useContext(AuthContext);
  const token = auth?.userToken;


  
  const ITEM_WIDTH = 301;        
  const ITEM_GAP = 20;          
  const INTERVAL = ITEM_WIDTH + ITEM_GAP; 
  const DURATION = 220;         

   const smoothScrollTo = (to: number, duration = DURATION) => {
    const from = offsetRef.current;
    const start = performance.now();
    const clamp = (n: number) => Math.max(0, n);

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = () => {
      const now = performance.now();
      const t = Math.min(1, (now - start) / duration);
      const eased = from + (to - from) * easeOutCubic(t);

      offsetRef.current = eased;
      listRef.current?.scrollToOffset({ offset: clamp(eased), animated: false });

      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const snapToNearest = () => {
    const raw = offsetRef.current;
    const idx = Math.round(raw / INTERVAL);
    const target = idx * INTERVAL;
    smoothScrollTo(target);
  };


  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await apiClient.get<Account[]>("/accounts/selected", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 15000,
        });
        console.log("📌 /accounts/selected 응답:", JSON.stringify(response.data, null, 2));
        setAccounts(response.data || []);
      } catch (err) {
        console.error("계좌 불러오기 실패:", err);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 계좌 없음: 디폴트 카드
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


  return (
    <View
      style={[
        styles.container,
        
        Platform.OS === "web"
          ? ({ cursor: draggingRef.current ? "grabbing" : "grab", userSelect: "none" } as any)
          : undefined,
      ]}
   
      onStartShouldSetResponder={() => Platform.OS === "web"}
      onResponderGrant={(e) => {
        if (Platform.OS !== "web") return;
        draggingRef.current = true;
        startXRef.current = e.nativeEvent.pageX;
        startOffsetRef.current = offsetRef.current;
      }}
      onResponderMove={(e) => {
        if (Platform.OS !== "web" || !draggingRef.current) return;
        const dx = e.nativeEvent.pageX - startXRef.current;
        const next = Math.max(0, startOffsetRef.current - dx);
        const lerp = 0.25;
        const eased = offsetRef.current + (next - offsetRef.current) * lerp;

        offsetRef.current = eased;
        listRef.current?.scrollToOffset({ offset: next, animated: false });
      }}
      onResponderRelease={() => {
        if (Platform.OS !== "web") return;
        draggingRef.current = false;
      }}
      onResponderTerminate={() => {
        if (Platform.OS !== "web") return;
        draggingRef.current = false;
      }}
    >
      <FlatList
        ref={listRef}
        data={accounts}
        keyExtractor={(item) => item.accountId}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={INTERVAL}
        snapToAlignment="start"
        onScroll={(e) => {
          offsetRef.current = e.nativeEvent.contentOffset.x || 0;
        }}
        scrollEventThrottle={16}
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

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.balance}>${item.currentBalance.toLocaleString()}</Text>
              <Text style={styles.subBalance}>Available ${item.availableBalance.toLocaleString()}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <TouchableOpacity onPress={() => router.push("/PlaidLinkScreen")}>
                <Text style={styles.linkText}>Link other account</Text>
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
    width: 301,
    height: 233,
    marginLeft: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 4,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#79758E",
  },
  accountType: {
    fontSize: 14,
    color: "#eee",
    alignSelf: "flex-end",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  line: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginVertical: 8,
  },
  balance: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  subBalance: {
    fontSize: 14,
    color: "#eee",
    marginBottom: 10,
  },
  cardFooter: {
    fontSize: 14,
    color: "#ddd",
    alignSelf: "flex-end",
  },
  linkText: {
    fontSize: 14,
    color: "#fff",
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
});

export default AccountSection;
