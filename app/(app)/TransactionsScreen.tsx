import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import apiClient from '../../api';
import EmotionalSpendingAnalysis from '../../components/EmotionalSpendingAnalysis';
import SpendingAnalysis from '../../components/SpendingAnalysis';

// 거래 데이터 타입
interface Transaction {
  name: string;
  amount: number;
  date: string;
  category: string;
  accountId: string | null; // 서버에서 null일 수도 있으니 null 허용
  transactionTime?: string | null;
}

// API 응답 타입
interface ApiResponse {
  topCategory: string;
  spendingByCategory: Record<string, number>;
  emotionalSpendingPattern: string;
  transactions: Transaction[];
}

// 선택된 계좌 타입 (백엔드 /accounts/selected 응답의 핵심만 사용)
interface Account {
  accountId: string;
  nickname?: string;
  name?: string;
}

const TransactionsScreen = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const IS_TEST_MODE = false;

  // 분석 + 거래내역 불러오기
  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        const endpoint = IS_TEST_MODE
          ? '/api/analysis/spending-pattern?test=true'
          : '/api/analysis/spending-pattern';

        const response = await apiClient.get<ApiResponse>(endpoint);
        if (!isActive) return;

        setData(response.data);

        // 🔎 디버그 로그
        console.log('✅ [analysis] 응답 전체:', response.data);
        console.log(
          '✅ [analysis] 첫 거래 샘플:',
          response.data.transactions?.[0]
        );
        const nullIdCount = (response.data.transactions || []).filter(
          (t) => !t.accountId
        ).length;
        console.log(
          `⚠️ [analysis] accountId가 비어있는 거래 수: ${nullIdCount} / ${
            response.data.transactions?.length || 0
          }`
        );
      } catch (error) {
        console.error('❌ 분석/거래 불러오기 실패:', error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isActive = false;
    };
  }, [IS_TEST_MODE]);

  // 선택된 계좌 불러오기
  useEffect(() => {
    let isActive = true;

    const fetchAccounts = async () => {
      try {
        const res = await apiClient.get<Account[]>('/accounts/selected');
        if (!isActive) return;

        setAccounts(res.data);

        // 🔎 디버그 로그
        console.log('✅ [/accounts/selected] 응답:', res.data);
      } catch (e) {
        console.error('❌ 계좌 불러오기 실패:', e);
      }
    };

    fetchAccounts();
    return () => {
      isActive = false;
    };
  }, []);

  // accountId → nickname 빠른 매칭을 위한 맵
  const accountMap = useMemo(() => {
    const map: Record<string, string> = {};
    accounts.forEach((a) => {
      if (!a || !a.accountId) return;
      // 닉네임이 없으면 name으로 fallback
      map[a.accountId] = a.nickname || a.name || '(이름 없음)';
    });
    // 🔎 맵 키 확인
    console.log('🗺️ accountMap keys:', Object.keys(map));
    return map;
  }, [accounts]);

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const nickname =
      (item.accountId && accountMap[item.accountId]) || '계좌 정보 없음';

    // 🔎 거래별 매칭 로그 (필요하면 주석 해제)
    // console.log(
    //   `🔗 match -> tx.accountId=${item.accountId} / nickname=${nickname}`
    // );

    const amountIsExpense = item.amount > 0;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
          {/* ✅ 무조건 렌더링해서 fallback이 보이도록 함 */}
          <Text style={styles.itemAccount}>계좌: {nickname}</Text>
        </View>

        <Text style={amountIsExpense ? styles.itemAmountNegative : styles.itemAmountPositive}>
          {amountIsExpense ? '- ' : '+ '}${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!data || !data.transactions || data.transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>거래 내역이 없습니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data.transactions}
        keyExtractor={(item, index) =>
          `${item.accountId ?? 'no-id'}-${item.name}-${item.date}-${item.amount}-${index}`
        }
        renderItem={renderTransactionItem}
        ListHeaderComponent={() => (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>소비 내역 및 분석</Text>
            </View>
            <EmotionalSpendingAnalysis analysisText={data.emotionalSpendingPattern} />
            <SpendingAnalysis transactions={data.transactions} />
            <Text style={styles.listTitle}>최근 거래 내역</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#f0f4f8',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      web: { borderWidth: 1, borderColor: '#e0e0e0' },
    }),
  },
  itemTextContainer: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemDate: { fontSize: 14, color: '#666', marginTop: 4 },
  itemAccount: { fontSize: 12, color: '#999', marginTop: 2 },
  itemAmountNegative: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c' },
  itemAmountPositive: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
});

export default TransactionsScreen;
