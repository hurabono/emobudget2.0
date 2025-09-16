import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import apiClient from '../../api';
import EmotionalSpendingAnalysis from '../../components/EmotionalSpendingAnalysis';
import SpendingAnalysis from '../../components/SpendingAnalysis';

// Transaction 데이터 타입을 정의합니다.
interface Transaction {
  name: string;
  amount: number;
  date: string;
  category: string;
}

//이제 API는 분석 데이터와 거래내역을 함께 보내줍니다.
interface ApiResponse {
  topCategory: string;
  spendingByCategory: Record<string, number>;
  emotionalSpendingPattern: string;
  transactions: Transaction[];
}

const TransactionsScreen = () => {
  // 거래내역과 분석 데이터를 하나의 상태로 관리합니다.
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  // test toggle
  const IS_TEST_MODE = true; 


useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        const endpoint = IS_TEST_MODE
          ? '/api/analysis/spending-pattern?test=true'
          : '/api/analysis/spending-pattern';

        const response = await apiClient.get<ApiResponse>(endpoint);
        if (isActive) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch analysis data:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [IS_TEST_MODE]);



  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
        <Text style={item.amount > 0 ? styles.itemAmountNegative : styles.itemAmountPositive}>
          {item.amount > 0 ? '- ' : '+ '}$
          {Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  //  data 객체 또는 data.transactions가 비어있는 경우를 확인합니다.
  if (!data || !data.transactions || data.transactions.length === 0) {
    return <View style={styles.loadingContainer}><Text>거래 내역이 없습니다.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        //  API 응답에 포함된 transactions 배열을 사용합니다.
        data={data.transactions}
        keyExtractor={(item, index) => `${item.name}-${item.date}-${item.amount}-${index}`}
        renderItem={renderTransactionItem}
        ListHeaderComponent={() => (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>소비 내역 및 분석</Text>
            </View>
            <EmotionalSpendingAnalysis analysisText={data.emotionalSpendingPattern} />
            {/* 이제 SpendingAnalysis 컴포넌트에 원본 거래 내역을 직접 전달합니다. */}
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
    header: { backgroundColor: '#ffffff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#111' },
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
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
        android: { elevation: 3 },
        web: { borderWidth: 1, borderColor: '#e0e0e0' },
      }),
    },
    itemTextContainer: { flex: 1, marginRight: 10 },
    itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
    itemDate: { fontSize: 14, color: '#666', marginTop: 4 },
    itemAmountNegative: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c' },
    itemAmountPositive: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  });

export default TransactionsScreen;