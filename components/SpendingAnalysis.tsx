import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// This interface must match the one in TransactionsScreen.tsx
interface Transaction {
  transaction_id: string;
  name: string;
  date: string;
  amount: number;
  category: string;
}

// Props definition remains the same
interface SpendingAnalysisProps {
  transactions: Transaction[];
}

// Helper function to generate a consistent color based on category name
const generateColor = (str: string) => {
  let hash = 0;
  if (str.length === 0) return '#CCCCCC';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Ensure 32bit integer
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const SpendingAnalysis = ({ transactions }: SpendingAnalysisProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Spending Analysis</Text>
        <Text style={styles.noDataText}>No transaction data available.</Text>
      </View>
    );
  }

  // Filter and accumulate spending by category
  const spendingByCategory = transactions
    .filter(t => t.amount > 0 && t.category !== 'Uncategorized' && t.category !== 'Other')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Create array and sort to get top 5
  const spendingData = Object.entries(spendingByCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  if (spendingData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Spending Analysis</Text>
        <Text style={styles.noDataText}>No spending data to display.</Text>
      </View>
    );
  }

  // Find total spending from top 5 categories
  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);
  // Find top category name
  const topCategory = spendingData[0].name;

  const maxSpending = spendingData[0].amount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 5 Spending Categories</Text>

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
                    shadowColor: generateColor(item.name),
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 4,
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartContainer: {
    width: '100%',
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
    backgroundColor: '#eee',
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
