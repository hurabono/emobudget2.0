// SpendingAnalysis.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import apiClient from '../api';

interface AnalysisData {
  topCategory: string;
  spendingByCategory: { [key: string]: number };
}

const SpendingAnalysis = () => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const fetchAnalysis = async () => {
      try {
        const res = await apiClient.get('/api/analysis/spending-pattern');
        if (isActive && res.data) setAnalysis(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    fetchAnalysis();
    return () => { isActive = false; };
  }, []);

  if (isLoading) return <ActivityIndicator size="large" style={{ marginVertical: 20 }} />;
  if (!analysis || Object.keys(analysis.spendingByCategory).length === 0)
    return <Text style={styles.errorText}>분석 데이터를 불러오지 못했습니다.</Text>;

  const chartData = Object.entries(analysis.spendingByCategory).map(([name, value], idx) => ({
    name,
    population: value,
    color: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF'][idx % 5],
    legendFontColor: "#7F7F7F",
    legendFontSize: 14,
  }));

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 40;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이번 달 소비 분석</Text>
      <Text style={styles.subtitle}>가장 많이 지출한 카테고리는 '{analysis.topCategory}' 입니다.</Text>

      <PieChart
            data={chartData}
            width={chartWidth}
            height={180}
            chartConfig={{
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
            }}
            accessor="population"
            backgroundColor="transparent"
            absolute
            paddingLeft="15" // 여기 추가
            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', borderRadius: 10, margin: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginVertical: 10 },
  errorText: { color: 'red' },
});

export default SpendingAnalysis;
