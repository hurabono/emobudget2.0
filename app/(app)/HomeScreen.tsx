// app/(app)/HomeScreen.tsx
import Screen from '@/components/Screen';
import Card from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import apiClient from '../../api';
import AccountSection from '../../components/AccountSection';
import EmotionalSpendingAnalysis from '../../components/EmotionalSpendingAnalysis';
import GradientBackground from '../../components/GradientBackground';
import Button from "../../components/ui/Button";
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
interface ApiResponse {
  topCategory: string;
  spendingByCategory: Record<string, number>;
  emotionalSpendingPattern: string;
  transactions: Transaction[];
}


interface Account {
  accountId: string;
  nickname?: string;
  name?: string;
}


const HomeScreen = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // ✅ 그대로 유지 (generateAdvice에서 참조)
  const [data, setData] = useState<{ transactions: Transaction[] } | null>(null);
  const [expenses, setExpenses] = useState<ImportantExpense[]>([]);
  const [dataApi, setDataApi] = useState<ApiResponse | null>(null); // ✅ 감정 분석/거래 응답 저장
  const token = authContext?.userToken;
  const [accounts, setAccounts] = useState<Account[]>([]);

  const IS_TEST_MODE = true;


  // 감정 분석 + 거래 목록 한번에 로드 (TransactionsScreen의 소스와 동일한 엔드포인트)
useEffect(() => {
  let alive = true;
  (async () => {
    try {
      const endpoint = IS_TEST_MODE
        ? '/api/analysis/spending-pattern?test=true'
        : '/api/analysis/spending-pattern';

      const res = await apiClient.get<ApiResponse>(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        timeout: 15000,
      });
      if (!alive) return;

      setDataApi(res.data);
      setData({ transactions: res.data.transactions || [] });
    } catch (e) {
      console.error('❌ 홈 감정/거래 로드 실패:', e);
    }
  })();
  return () => { alive = false; };
}, [token, IS_TEST_MODE]);


  // 가장 가까운 지출 1개 > Important Expense
  useEffect(() => {
    const fetchNextExpense = async () => {
      try {
        const res = await fetch("https://emobudgetserver.onrender.com/api/expenses/me/next", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
    if (token) fetchNextExpense();
  }, [token]);



  useEffect(() => {
  let alive = true;
  (async () => {
    try {
      const res = await apiClient.get<Account[]>('/accounts/selected', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        timeout: 15000,
      });
      if (!alive) return;
      setAccounts(res.data || []);
    } catch (e) {
      console.error('❌ [/accounts/selected] 불러오기 실패:', e);
    }
  })();
  return () => { alive = false; };
}, [token]);



  function generateAdvice(expense: ImportantExpense, transactions: Transaction[]): string {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const recentSpending = transactions
      .filter((tx) => new Date(tx.date) >= twoWeeksAgo)
      .reduce((sum, tx) => (["SHOPS", "FOOD_AND_DRINK"].includes(tx.category) ? sum + tx.amount : sum), 0);

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


  const accountMap = React.useMemo(() => {
  const map: Record<string, string> = {};
  accounts.forEach(a => {
    if (!a || !a.accountId) return;
    map[a.accountId] = a.nickname || a.name || '(이름 없음)';
      });
      return map;
    }, [accounts]);

    function getAccountNickname(t: Transaction): string {
    const anyT = t as any;
    return (
      anyT.accountNickname ||
      anyT.accountName ||
      (
        anyT.accountId &&
        anyT.accountId !== 'NO_ACCOUNT' &&
        accountMap[anyT.accountId]
          ? accountMap[anyT.accountId]
          : 'No account information'
      )
    );
  }



  const nextExpense = expenses.length
    ? [...expenses].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
    : null;

  const handleDelete = async () => {
    Alert.alert('Delete Account', 'This action is irreversible. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await apiClient.delete('/api/auth/delete-account', {
              headers: { Authorization: `Bearer ${token}` }
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
    <GradientBackground >
      <Screen style={styles.container}>
        <Text style={styles.header}>EMOBUDGET</Text>
        <View className='flex flex-row mb-5'>
          <Ionicons name="cloud-outline" size={25} color="white" />
          <Text className='font-lg font-flex tracking-wider' style={styles.email}>
            Hi {authContext?.userEmail ?? "Unknown user"}
          </Text>
        </View>

        {nextExpense && (
          <Card>
            <Text className='font-flex text-2xl text-brand-blush font-bold tracking-wide mb-4'>
              Upcoming expense
            </Text>
            <Text className='font-flex text-white text-lg tracking-wide'>
              {nextExpense.dueDate} : {nextExpense.name} - ${nextExpense.amount}
            </Text>
            <Text className='text-white font-flex tracking-wide'>
              {nextExpense.advice ?? generateAdvice(nextExpense, data?.transactions || [])}
            </Text>
            {nextExpense.amount >= 1000 && (
              <Text className='text-brand-lilac font-flex tracking-wide mt-3'>
                A large amount of ${nextExpense.amount} will be withdrawn.
              </Text>
            )}
          </Card>
        )}

        <AccountSection />

        <View style={{ marginTop: 12, alignItems: "flex-end" }}>
                <TouchableOpacity onPress={() => router.push("/AccountSelectionScreen")}>
                  <Text style={{ color: "#79758E", fontSize: 14, fontWeight: "600" }}>
                    Select Accounts →
                  </Text>
                </TouchableOpacity>
        </View>

        {dataApi && (
          <EmotionalSpendingAnalysis analysisText={dataApi.emotionalSpendingPattern} />
        )}


        {/* ✅ 최근 거래 Top 10 카드 */}
        {data?.transactions?.length ? (
          <Card>
            <Text className='font-flex text-2xl text-brand-blush font-bold tracking-wide mb-4'>
              Recent transactions
            </Text>

            {data.transactions.slice(0, 10).map((t, idx) => (
              <LinearGradient
                        colors={["#FBCBC9", "#93A9D1"]}
                        start={{ x: 0, y: 2 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.txRow}
                        key={`${(t as any).accountId ?? 'noacct'}-${t.name}-${t.date}-${t.amount}-${idx}`}
                      >
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1 }}>
                  <Text className='font-flex' style={styles.txName}>{t.name}</Text>
                  <Text className='font-flex' style={styles.txSub}>{t.date}</Text>
                </View>

                <Text style={styles.txSub}>
                  {t.date} · {getAccountNickname(t)}
                </Text>
                </View>

                <Text style={t.amount > 0 ? styles.txMinus : styles.txPlus}>
                  {t.amount > 0 ? '- ' : '+ '}${Math.abs(t.amount).toFixed(2)}
                </Text>
              </LinearGradient>
            ))}

              <View style={{ marginTop: 12, alignItems: "flex-end" }}>
                <TouchableOpacity onPress={() => router.push("/TransactionsScreen")}>
                  <Text style={{ color: "#FBCBC9", fontSize: 14, fontWeight: "600" }}>
                    View more →
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ) : null}

        <View style={styles.buttonContainer}>
          <Button label="Logout" onPress={() => authContext?.logout()}/>
        </View>


        <View style={{ marginTop: 10, alignItems: "center" }}>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={{ color: "#79758E", fontSize: 14, fontWeight: "600" }}>
                    Delete Account
              </Text>
            </TouchableOpacity>
        </View>


      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
    
  },

  text: { fontSize: 20, color: '#333', marginBottom: 20 },
  buttonContainer: { width: '100%', marginTop: 10 },
  highlightBox: { padding: 16, backgroundColor: '#fff3cd', borderRadius: 8, marginBottom: 20 },
  bigExpenseWarning: { marginTop: 8, color: 'red', fontWeight: 'bold' },
  email: {
    textAlign: 'center', fontSize: 18, color: '#fff', marginLeft: 18,
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  header: {     
    fontSize: 25,          
    fontWeight: "bold",
    color: "#fff", 
    textAlign: "left",
    marginBottom: 10,
    marginTop:20,
    textShadowColor: "rgba(255, 255, 255, 0.9)", 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,      
  },
  txRow: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  marginVertical: 6,
  borderRadius: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  },
  txName: { fontSize: 16, fontWeight: '600', color: '#79758E' },
  txSub: { fontSize: 12, color: '#79758E', marginTop: 2 },
  txMinus: { fontSize: 16, fontWeight: 'bold', color: '#fafafa' },
  txPlus: { fontSize: 16, fontWeight: 'bold', color: '#fafafa' },
});

export default HomeScreen;
