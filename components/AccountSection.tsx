// components/AccountSection.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import apiClient from '../api';

interface Account {
  accountId: string;
  nickname: string;
  currentBalance: number;
  availableBalance: number;
}

const AccountSection = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await apiClient.get<Account[]>('/accounts/selected');
         console.log("📌 /accounts/selected 응답:", JSON.stringify(response.data, null, 2)); 
         
        setAccounts(response.data);
      } catch (err) {
        console.error('계좌 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (accounts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>선택된 계좌가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 계좌</Text>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.accountId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nickname}>{item.nickname}</Text>
            <Text style={styles.balance}>
              잔액: {item.currentBalance.toLocaleString()}원
            </Text>
            <Text style={styles.subBalance}>
              사용 가능: {item.availableBalance.toLocaleString()}원
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  nickname: { fontSize: 16, fontWeight: '600' },
  balance: { fontSize: 14, color: '#333', marginTop: 4 },
  subBalance: { fontSize: 13, color: '#666', marginTop: 2 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#666' },
});

export default AccountSection;
