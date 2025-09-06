// app/(app)/HomeScreen.tsx
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Login Successful!</Text>
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

// Add your original styles object here...
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  text: { fontSize: 20, color: '#333', marginBottom: 20 },
  buttonContainer: { width: '100%', marginTop: 10 },
});

export default HomeScreen;