import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import apiClient from "../api";

// Expo SDK 50+ notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface ImportantExpenseBase {
  id?: number | string;
  name: string;
  amount: number;
  dueDate: string; // ISO
}
interface ImportantExpenseDTO extends ImportantExpenseBase {
  advice?: string;
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
  const [expenses, setExpenses] = useState<ImportantExpenseDTO[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  // 서버에서 “내” 지출 불러오기
  const fetchExpenses = async () => {
    try {
      const res = await apiClient.get<ImportantExpenseDTO[]>("/api/expenses/me");
      setExpenses(res.data || []);
    } catch (e) {
      console.error("❌ Failed to fetch expenses:", e);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 삭제 함수
  const handleDelete = async (id: number | string) => {
    try {
      await apiClient.delete(`/api/expenses/${id}`);
      await fetchExpenses(); // 삭제 후 새로고침
    } catch (e) {
      console.error("❌ Failed to delete expense:", e);
    }
  };

  // (폴백) 클라이언트 조언
  function generateAdvice(expense: ImportantExpenseBase, txs: Transaction[]): string {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentSpending = txs
      .filter((tx) => new Date(tx.date) >= twoWeeksAgo)
      .reduce(
        (sum, tx) => (["SHOPS", "FOOD_AND_DRINK"].includes(tx.category) ? sum + tx.amount : sum),
        0
      );

    if (expense.amount >= 1000 && recentSpending >= 700) {
      return `Spending More Recent Spending Compared to Planned Spending ${expense.name}. Cut Spending This Week!`;
    }
    if (expense.amount <= 500 && recentSpending <= 300) {
      return `We are in a relaxed state compared to the estimated expenditure of ${expense.name}`;
    }
    return `There are no specific issues for the upcoming ${expense.name}.`;
  }

  // 추가(POST) → 저장 후 /me 재조회
  const addExpense = async () => {
    if (!name || !amount || !dueDate) return;

    try {
      await apiClient.post("/api/expenses", {
        name,
        amount: parseFloat(amount),
        dueDate,
      });

      await fetchExpenses();
      setName("");
      setAmount("");
      setDueDate("");
    } catch (e) {
      console.error("❌ Failed to save expense:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 중요 지출 관리</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense (e.g. Rent)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount of Money"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="dates (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Add" onPress={addExpense} />

      <FlatList
          data={expenses}
          keyExtractor={(item, idx) =>
            item.id ? String(item.id) : `${item.name}-${item.dueDate}-${item.amount}-${idx}`
          }
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text>
                {item.name} - ${item.amount} (📅 {item.dueDate})
              </Text>
              <Text style={styles.advice}>{generateAdvice(item, transactions)}</Text>

              {/* ✅ 삭제 아이콘 버튼 */}
              {item.id && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id!)}
                >
                  <Ionicons name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              )}
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
  deleteButton: {
   position: "absolute",
  top: 5,
  right: 5,
},
deleteButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  lineHeight: 16,
},

});

export default ImportantExpenseSection;
