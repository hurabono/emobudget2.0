// app/(app)/HomeScreen.tsx
import Screen from '@/components/Screen';
import Card from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import apiClient from '../../api';
import AccountSection from '../../components/AccountSection';
import GradientBackground from '../../components/GradientBackground';
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
  advice?: string;
}

const HomeScreen = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState<{ transactions: Transaction[] } | null>(null);
  const [expenses, setExpenses] = useState<ImportantExpense[]>([]);

  

  useEffect(() => {
  const fetchNextExpense = async () => {
    try {
      const res = await fetch("https://emobudgetserver.onrender.com/api/expenses/me/next", {
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
      return `Spending More Recent Spending Compared to Planned Spending ${expense.name}. Cut Spending This Week!`;
    }

    if (expense.amount <= 500 && recentSpending <= 300) {
      return `We are in a relaxed state compared to the estimated expenditure of ${expense.name}`;
    }

    const lastWeekendSpending = transactions
      .filter((tx) => {
        const d = new Date(tx.date);
        return d.getDay() === 6 || d.getDay() === 0;
      })
      .filter((tx) => tx.category === "SHOPS")
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (lastWeekendSpending >= 200) {
      return `${expense.name} Use $${lastWeekendSpending} for weekend shopping before payment, be warned.`;
    }

    return `There are no specific issues for the upcoming ${expense.name}.`;
  }

  // 📌 가장 가까운 예정 지출 1개만 가져오기
  const nextExpense = expenses.length
    ? [...expenses].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0]
    : null;
  
  const handleDelete = async () => {
    Alert.alert('Delete Account', 'This action is irreversible. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await apiClient.delete('/api/auth/delete-account', {
              headers: { Authorization: `Bearer ${authContext?.userToken}` }
            });
            Alert.alert('Done', 'Your account has been deleted.');
            await authContext?.logout();
          } catch (e: any) {
            const msg = e.response?.data || e.message || 'Failed to delete account.';
            Alert.alert('Error', msg);
          }
        }
      }
    ]);
  };


  return (
    <GradientBackground>
      <Screen>
        <View className='flex flex-row mb-5'>
          <Ionicons name="cloud-outline" size={35} color="white" />
          <Text className='font-lg font-flex tracking-wider' style={styles.email}>
            Hi {authContext?.userEmail ?? "Unknown user"}
          </Text>
        </View>

        {/* 상단: 가장 가까운 지출 1개만 표시 */}
        {nextExpense && (
          <Card>
            <Text className='font-flex text-2xl text-brand-blush font-bold tracking-wide mb-4'>Upcoming expense </Text>

            <Text className='font-flex text-white text-lg tracking-wide'>
              {nextExpense.dueDate} : {nextExpense.name} - ${nextExpense.amount}
            </Text>
            <Text className='text-white font-flex tracking-wide'>
              {nextExpense.advice ?? generateAdvice(nextExpense, data?.transactions || [])}
            </Text>

            {/* 💡 1000달러 이상이면 추가 경고 */}
            {nextExpense.amount >= 1000 && (
              <Text className='text-brand-lilac font-flex tracking-wide mt-3'>
                A large amount of ${nextExpense.amount} will be withdrawn.
              </Text>
            )}
          </Card>
        )}


        <AccountSection />
        <View style={styles.buttonContainer}>
          <Button title="Link Bank Account" onPress={() => router.push('/PlaidLinkScreen')} />
        </View>
        <View style={styles.buttonContainer}>
        
        <Button
          title="Select Accounts"
          onPress={() => router.push('/AccountSelectionScreen')}
        />
      </View>

        <View style={styles.buttonContainer}>
          <Button title="Logout" onPress={() => authContext?.logout()} color="#888" />
        </View>
        <Button title="Delete Account" onPress={handleDelete} />
      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    padding: 20 
  },
  text: { 
    fontSize: 20, 
    color: '#333', 
    marginBottom: 20 
  },
  buttonContainer: { 
    width: '100%', 
    marginTop: 10 
  },
  highlightBox: { 
    padding: 16, 
    backgroundColor: '#fff3cd', 
    borderRadius: 8, 
    marginBottom: 20 
  },
  bigExpenseWarning: { 
    marginTop: 8, 
    color: 'red', 
    fontWeight: 'bold' 
  },
  email: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',      // 배경 위에서 보이게 흰색
    marginLeft:18,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center'
  },
});

export default HomeScreen;
