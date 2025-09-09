import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import apiClient from '../../api';
import SpendingAnalysis from '../../components/SpendingAnalysis';

// 실제 백엔드 API(/api/transactions)가 반환하는 데이터 구조와 정확히 일치시킵니다.
// personal_finance_category 객체 대신 category 문자열을 사용합니다.
interface Transaction {
  name: string;
  amount: number;
  date: string;
  category: string;
}

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect has been made more robust
  useEffect(() => {
    let isActive = true; 

    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get('/api/transactions');
        // Only update state if the component is still active
        if (isActive) {
        
          // 백엔드에서 transaction_id를 보내주지 않으므로, 이 부분은 클라이언트에서 고유 ID를 생성해 주거나
          // API 응답에 id를 포함하도록 수정해야 합니다. 지금은 임시로 인덱스를 사용합니다.
          // 또한, API 응답 데이터가 Transaction[] 타입과 일치하므로 바로 상태에 설정합니다.
          setTransactions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();

    // This is the cleanup function
    return () => {
      isActive = false;
    };
  }, []);




const renderTransactionItem = ({ item }: { item: Transaction }) => {
  // 09092025
  // personal_finance_category가 아닌, API 응답에 포함된 category 필드를 직접 사용합니다.
  const displayCategory = item.category || "Uncategorized";

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <Text style={item.amount < 0 ? styles.itemAmountNegative : styles.itemAmountPositive}>
        {/*09092025  지출(양수) 금액 앞에 -를 붙여 일관성을 유지합니다. 백엔드에서 이미 양수로 처리되어 있습니다. */}
        {item.amount > 0 ? '- ' : ''}
        {Math.abs(item.amount).toFixed(2)} CAD
      </Text>
    </View>
  );
};


  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  if (transactions.length === 0) {
    return <View style={styles.loadingContainer}><Text>No transactions found.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Transactions</Text>
        </View>
        {/* 09092025 이제 transactions 데이터가 SpendingAnalysis가 기대하는 타입과 일치하여 오류가 없습니다. */}
        <SpendingAnalysis transactions={transactions}  />
        <FlatList
            // 09092025
            // transaction_id가 없으므로, 각 항목을 고유하게 식별할 수 있는 더 안정적인 키를 만듭니다.
            // 여기서는 이름, 날짜, 금액, 인덱스를 조합하여 고유성을 보장합니다.
            data={transactions}
            keyExtractor={(item, index) => `${item.name}-${item.date}-${item.amount}-${index}`}
            renderItem={renderTransactionItem}
        />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#ffffff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#111' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { backgroundColor: '#fff', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 3, }, web: { borderWidth: 1, borderColor: '#e0e0e0', }, }), },
  itemTextContainer: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemCategory: { fontSize: 12, fontWeight: '600', color: '#ccc' },
  itemDate: { fontSize: 14, color: '#666', marginTop: 4 },
  itemAmountNegative: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemAmountPositive: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
});

export default TransactionsScreen;