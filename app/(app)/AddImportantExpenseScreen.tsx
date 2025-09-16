import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import ImportantExpenseSection from "../../components/ImportantExpenseSection";

const AddImportantExpenseScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImportantExpenseSection transactions={[]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
});

export default AddImportantExpenseScreen;
