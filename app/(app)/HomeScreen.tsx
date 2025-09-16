// app/(app)/HomeScreen.tsx
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';


interface Transaction {
  name: string;
  amount: number;
  date: string; 
  category: string;
}

interface ImportantExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

const HomeScreen = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState<{ transactions: Transaction[] } | null>(null);
  
  const [expenses, setExpenses] = useState<ImportantExpense[]>([]);
  

  useEffect(() => {
  const fetchNextExpense = async () => {
    try {
      const res = await fetch("https://emobudget-server.onrender.com/api/expenses/me/next", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authContext?.userToken}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("서버 에러:", res.status, text);
        return;
      }

    
      const text = await res.text();
      if (!text) {
        setExpenses([]);
        return;
      }
      const json = JSON.parse(text);
      setExpenses(json ? [json] : []);

    } catch (error) {
      console.error(error);
    }
  };

  fetchNextExpense();
}, [authContext?.userToken]);



  // generateAdvice 함수 (ImportantExpenseSection과 동일)
  function generateAdvice(expense: ImportantExpense, transactions: Transaction[]): string {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentSpending = transactions
      .filter((tx) => new Date(tx.date) >= twoWeeksAgo)
      .reduce((sum, tx) => {
        if (["SHOPS", "FOOD_AND_DRINK"].includes(tx.category)) {
          return sum + tx.amount;
        }
        return sum;
      }, 0);

    if (expense.amount >= 1000 && recentSpending >= 700) {
      return `🚨 예정 지출 ${expense.name} 대비 최근 소비가 많습니다. 이번 주 소비를 줄이세요!`;
    }

    if (expense.amount <= 500 && recentSpending <= 300) {
      return `✅ 예정 지출 ${expense.name} 대비 여유 있는 상태입니다 👍`;
    }

    const lastWeekendSpending = transactions
      .filter((tx) => {
        const d = new Date(tx.date);
        return d.getDay() === 6 || d.getDay() === 0;
      })
      .filter((tx) => tx.category === "SHOPS")
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (lastWeekendSpending >= 200) {
      return `📊 ${expense.name} 납부 전 주말 쇼핑에 $${lastWeekendSpending} 사용, 주의하세요.`;
    }

    return `다가오는 ${expense.name} 대비 특별한 문제는 없습니다.`;
  }

  // 📌 가장 가까운 예정 지출 1개만 가져오기
  const nextExpense = expenses.length
    ? [...expenses].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0]
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Login Successful!</Text>

      {/* 상단: 가장 가까운 지출 1개만 표시 */}
      {nextExpense && (
        <View style={styles.highlightBox}>
          <Text>
            {nextExpense.name} - ${nextExpense.amount} (📅 {nextExpense.dueDate})
          </Text>
          <Text>
            {generateAdvice(nextExpense, data?.transactions || [])}
          </Text>

          {/* 💡 1000달러 이상이면 추가 경고 */}
          {nextExpense.amount >= 1000 && (
            <Text style={styles.bigExpenseWarning}>
              ⚠️ 곧 큰 금액(${nextExpense.amount})이 빠져나갈 예정입니다.
            </Text>
          )}
        </View>
      )}

      {/* 지출 추가 버튼 → 별도 페이지로 이동 */}
      <View style={styles.buttonContainer}>
        <Button
          title="중요한 지출 추가"
          onPress={() => router.push('/AddImportantExpenseScreen')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Link Bank Account" onPress={() => router.push('/PlaidLinkScreen')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="View Transactions" onPress={() => router.push('/TransactionsScreen')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={() => authContext?.logout()} color="#888" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  text: { fontSize: 20, color: '#333', marginBottom: 20 },
  buttonContainer: { width: '100%', marginTop: 10 },
  highlightBox: { padding: 16, backgroundColor: '#fff3cd', borderRadius: 8, marginBottom: 20 },
  bigExpenseWarning: { marginTop: 8, color: 'red', fontWeight: 'bold' },
});

export default HomeScreen;
