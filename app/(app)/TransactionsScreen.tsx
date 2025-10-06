// app/(app)/TransactionsScreen.tsx
import Screen from '@/components/Screen';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import GradientBackground from '../../components/GradientBackground';
import SpendingAnalysis from '../../components/SpendingAnalysis';
import { AuthContext } from '../../context/AuthContext';

// 거래 데이터 타입
interface Transaction {
  name: string;
  amount: number;
  date: string;
  category: string;
  accountId: string | null; 
  transactionTime?: string | null;
  accountName?: string;
  accountMask?: string;
  accountNickname?: string;
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

  // 필요 시 true로 바꿔 테스트 고정 사용
  const IS_TEST_MODE = true;
  const USE_TEST_DATA = IS_TEST_MODE && accounts.length > 0;


  // 실제 호출 시 인증 헤더가 필요할 수 있으므로 토큰 사용 (추가)
  const auth = useContext(AuthContext);
  const token = auth?.userToken || null;

  // 분석 + 거래내역 불러오기
  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        const endpoint = USE_TEST_DATA

          ? '/api/analysis/spending-pattern?test=true'
          : '/api/analysis/spending-pattern';

        // 실제 모드면 Authorization 헤더와 타임아웃 추가
        const response = await apiClient.get<ApiResponse>(endpoint, {
          headers: !USE_TEST_DATA && token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 20000,
        });

        if (!isActive) return;
        setData(response.data);

        // Debug Log
        console.log('[analysis] Entire Response:', response.data);
        console.log('[analysis] Firtst Transaction sample:', response.data.transactions?.[0]);
        const nullIdCount = (response.data.transactions || []).filter((t) => !t.accountId).length;
        console.log(`⚠️ [analysis] Empty Transaction accountId: ${nullIdCount} / ${response.data.transactions?.length || 0}`);

      } catch (error: any) {

        console.error('❌ Failed to load transaction:', error?.code || error?.message || error);

        // 폴백: 실모드 실패/타임아웃이면 즉시 테스트 데이터로 재시도 (추가)
        if (!USE_TEST_DATA) {
          try {
            const fallback = await apiClient.get<ApiResponse>(
              '/api/analysis/spending-pattern?test=true',
              { timeout: 10000 }
            );
            if (!isActive) return;
            setData(fallback.data);
            console.log('🔁 Fallback successed testdata');
          } catch (fbErr) {
            console.error('❌ Failed test data load:', fbErr);
          }
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isActive = false;
    };
    }, [USE_TEST_DATA, token, accounts.length]);




  // 선택된 계좌 불러오기
  useEffect(() => {
    let isActive = true;

    const fetchAccounts = async () => {
      try {
        const res = await apiClient.get<Account[]>('/accounts/selected', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 15000,
        });
        if (!isActive) return;

        setAccounts(res.data);
        console.log('✅ [/accounts/selected] response:', res.data);
      } catch (e) {
        console.error('❌ Failed load accounts:', e);
      }
    };

    fetchAccounts();
    return () => {
      isActive = false;
    };
  }, [token]);




  // accountId >>  nickname mapping
  const accountMap = useMemo(() => {
    const map: Record<string, string> = {};
    accounts.forEach((a) => {
      if (!a || !a.accountId) return;
      map[a.accountId] = a.nickname || a.name || '(no name)';
    });
    console.log('🗺️ accountMap keys:', Object.keys(map));
    return map;
  }, [accounts]);

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const nickname =
      item.accountNickname
      || item.accountName
      || ((item.accountId && item.accountId !== 'NO_ACCOUNT' && accountMap[item.accountId])
          ? accountMap[item.accountId]
          : 'No account information');

    const amountIsExpense = item.amount > 0;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text className='font-flex text-brand-blush' style={styles.itemName}>{item.name}</Text>
          <Text className='font-flex text-brand-blush' style={styles.itemDate}>{item.date}</Text>
          <Text className='font-flex text-brand-lilac' style={styles.itemAccount}>Account: {nickname}</Text>
        </View>

        <Text
          style={
            amountIsExpense
              ? styles.itemAmountNegative
              : styles.itemAmountPositive
          }
        >
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
        <Text>There is no transaction history.</Text>
      </View>
    );
  }

  return (
    <GradientBackground>
      <Screen center centerVertically maxWidth={480}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data.transactions}
          keyExtractor={(item, index) =>
            `${item.accountId ?? 'no-id'}-${item.name}-${item.date}-${item.amount}-${index}`
          }
          renderItem={renderTransactionItem}
          ListHeaderComponent={() => (
            <>
              <View>
                <Text style={styles.headerTitle}>Transaction List</Text>
              </View>

              <SpendingAnalysis  transactions={data.transactions} />

            </>
          )}
        />
      </SafeAreaView>
      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'transparent', 
    position: 'relative', 
    zIndex: 100, 
    ...Platform.select({ android: { elevation: 1 } }) 
  },
  headerTitle: { 
    fontSize: 25,          
    fontWeight: "bold",
    color: "#fff", 
    textAlign: "left",
    marginBottom: 10,
    marginTop:20,
    paddingLeft:10,
    textShadowColor: "rgba(255, 255, 255, 0.9)", 
    textShadowOffset: { 
      width: 0, 
      height: 0 
    },
    textShadowRadius: 12,  
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  itemContainer: {
    backgroundColor: '#2e2e2eff',
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
        shadowOffset: { 
          width: 0, 
          height: 2 
        }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      },
      android: { 
        elevation: 3 
      },
      web: { 
        borderWidth: 1, 
        borderColor: '#e0e0e0' 
      },
    }),
  },
  itemTextContainer: { 
    flex: 1, 
    marginRight: 10 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  itemDate: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4 
  },
  itemAccount: { 
    fontSize: 12, 
    marginTop: 12 
  },
  itemAmountNegative: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#E4E1EC' 
  },
  itemAmountPositive: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2ecc71' 
  },
});

export default TransactionsScreen;
