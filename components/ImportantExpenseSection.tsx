import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform } from "react-native";
import * as Notifications from "expo-notifications";

// 📌 알림 핸들러 설정 (Expo SDK 50+)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface ImportantExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO 날짜
}

interface Transaction {
  name: string;
  amount: number;
  date: string; // ISO
  category: string;
}

interface Props {
  transactions: Transaction[];
}

const ImportantExpenseSection: React.FC<Props> = ({ transactions }) => {
  const [expenses, setExpenses] = useState<ImportantExpense[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  // 📌 알림 권한 요청
  useEffect(() => {
    if (Platform.OS !== "web") {
      (async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("알림 권한이 필요합니다 🚨");
        }
      })();
    }
  }, []);

  // 🔔 알림 예약 함수
  async function scheduleExpenseNotification(expense: ImportantExpense) {
    if (Platform.OS === "web") return;

    const due = new Date(expense.dueDate);
    if (isNaN(due.getTime())) return;

    const now = new Date();
    const twoWeeksBefore = new Date(due.getTime() - 14 * 24 * 60 * 60 * 1000);

    const scheduleAtDate = async (when: Date, title: string, body: string) => {
      if (when.getTime() <= now.getTime()) return;

      await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: {
          type: "date",
          date: when,
        } as Notifications.NotificationTriggerInput, // ✅ 타입 캐스팅으로 오류 제거
      });
    };

    // 2주 전 알림
    await scheduleAtDate(
      twoWeeksBefore,
      "다가오는 지출",
      `${expense.name} - $${expense.amount} (2주 뒤 예정)`
    );

    // 당일 알림
    await scheduleAtDate(
      due,
      "오늘 지출일!",
      `${expense.name} - $${expense.amount} 결제 예정`
    );
  }

  // 💡 조언 생성
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

  // ➕ 지출 추가
  const addExpense = () => {
    if (!name || !amount || !dueDate) return;

    const newExpense: ImportantExpense = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      dueDate,
    };

    setExpenses((prev) => [...prev, newExpense]);
    scheduleExpenseNotification(newExpense);

    setName("");
    setAmount("");
    setDueDate("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 중요 지출 관리</Text>

      <TextInput
        style={styles.input}
        placeholder="지출명 (예: 렌트)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="금액 (USD)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="날짜 (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="추가" onPress={addExpense} />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>
              {item.name} - ${item.amount} (📅 {item.dueDate})
            </Text>
            <Text style={styles.advice}>{generateAdvice(item, transactions)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", marginTop: 20, borderRadius: 8 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 8, marginBottom: 10, borderRadius: 6 },
  expenseItem: { marginVertical: 8, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 6 },
  advice: { marginTop: 4, fontSize: 14, color: "#555" },
});

export default ImportantExpenseSection;
