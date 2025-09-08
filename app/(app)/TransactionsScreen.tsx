import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import apiClient from '../../api';
import SpendingAnalysis from '../../components/SpendingAnalysis';
interface Transaction {
  transaction_id: string;
  name: string;
  date: string;
  amount: number;
  personal_finance_category: {
    primary: string;
    detailed: string;
  };
}

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect has been made more robust
  useEffect(() => {
    let isActive = true; // 1. Flag to track if the component is still mounted

    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get('/api/transactions');
        // 2. Only update state if the component is still active
        if (isActive) {
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

    // 3. This is the cleanup function
    return () => {
      isActive = false;
    };
  }, []); // The empty array is correct, do not change it




const renderTransactionItem = ({ item }: { item: Transaction }) => {
  // personal_finance_category가 없으면 "Uncategorized" 출력
  const displayCategory = item.personal_finance_category?.primary || "Uncategorized";

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <Text style={item.amount < 0 ? styles.itemAmountNegative : styles.itemAmountPositive}>
        {item.amount < 0 ? '' : '-'} {Math.abs(item.amount).toFixed(2)} CAD
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
        <SpendingAnalysis transactions={transactions}  />
        <FlatList
            data={transactions}
            keyExtractor={(item) => item.transaction_id || `${item.name}-${item.date}`}
            renderItem={renderTransactionItem}
        />
    </SafeAreaView>
  );
};

// Styles remain the same
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