import Screen from '@/components/Screen';
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import GradientBackground from '../../components/GradientBackground';
import ImportantExpenseSection from "../../components/ImportantExpenseSection";


const AddImportantExpenseScreen = () => {
  return (
    <GradientBackground>
      <Screen center maxWidth={480}>
        <SafeAreaView >
          <ImportantExpenseSection transactions={[]} />
        </SafeAreaView>
      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({

});

export default AddImportantExpenseScreen;
