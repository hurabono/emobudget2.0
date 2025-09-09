import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


// 이 컴포넌트가 사용할 데이터 타입을 다시 정의합니다.
// 이제 TransactionScreen으로부터 원본 거래 내역 배열을 직접 받습니다.
interface Transaction {
  name: string;
  date: string;
  amount: number;
  category: string;
}

interface SpendingAnalysisProps {
  transactions: Transaction[];
}

const generateColor = (str: string) => {
  let hash = 0;
  if (str.length === 0) return '#CCCCCC';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const SpendingAnalysis = ({ transactions }: SpendingAnalysisProps) => {
  // --- [수정] ---
  // props로 받은 transactions 배열을 직접 분석하여 차트 데이터를 생성하는 로직을 복원합니다.
  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>소비 카테고리 분석</Text>
        <Text style={styles.noDataText}>분석할 소비 데이터가 없습니다.</Text>
      </View>
    );
  }

  // 지출 내역만 필터링하고 카테고리별로 합산합니다.
  const spendingByCategory = transactions
    .filter(t => t.amount > 0 && t.category && t.category !== 'Uncategorized')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // 상위 5개 카테고리를 계산합니다.
  const spendingData = Object.entries(spendingByCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  if (spendingData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>소비 카테고리 분석</Text>
        <Text style={styles.noDataText}>표시할 지출 내역이 없습니다.</Text>
      </View>
    );
  }

  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);
  const topCategory = spendingData[0].name;
  const maxSpending = spendingData[0].amount;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 5 소비 카테고리</Text>
      <Text style={styles.summaryText}>
        가장 많이 지출한 카테고리는 '{topCategory}' 입니다.
      </Text>
      <Text style={styles.summaryText}>
        총 지출 금액: ${totalSpending.toFixed(2)}
      </Text>
      <View style={styles.chartContainer}>
        {spendingData.map(item => (
          <View key={item.name} style={styles.barRow}>
            <Text style={styles.barLabel} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    width: maxSpending > 0 ? `${(item.amount / maxSpending) * 100}%` : '0%',
                    backgroundColor: generateColor(item.name),
                  },
                ]}
              />
            </View>
            <Text style={styles.barAmount}>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 바 그래프가 더 잘 보이도록 스타일을 약간 조정합니다.
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e6ef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartContainer: {
    width: '100%',
    marginTop: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 30,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  barLabel: {
    width: 110,
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
    marginRight: 12,
  },
  barWrapper: {
    flex: 1,
    height: 26,
    backgroundColor: '#ecf0f1',
    borderRadius: 13,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 13,
  },
  barAmount: {
    width: 80,
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    textAlign: 'right',
    marginLeft: 12,
  },
});

export default SpendingAnalysis;