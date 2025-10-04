import Screen from '@/components/Screen';
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import GradientBackground from '../../components/GradientBackground';
import ImportantExpenseSection from "../../components/ImportantExpenseSection";


const AddImportantExpenseScreen = () => {
  return (
    <GradientBackground>
      <Screen>
        <SafeAreaView style={styles.container}>
          <ImportantExpenseSection transactions={[]} />
        </SafeAreaView>
      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
});

export default AddImportantExpenseScreen;
