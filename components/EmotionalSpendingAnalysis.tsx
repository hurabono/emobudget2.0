import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmotionalSpendingAnalysisProps {
  analysisText?: string;
}

const EmotionalSpendingAnalysis = ({ analysisText }: EmotionalSpendingAnalysisProps) => {
  if (!analysisText) {
    return null;
  }

  // AI 분석 결과에서 각 패턴을 줄바꿈 기준으로 분리합니다.
  const analysisLines = analysisText.split('\n');
  const title = analysisLines[0];
  const patterns = analysisLines.slice(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 감정 소비 분석 🧐</Text>
      <Text style={styles.summaryText}>{title}</Text>
      <View style={styles.patternsContainer}>
        {patterns.map((line, index) => (
          line.trim() ? <Text key={index} style={styles.patternItem}>{line}</Text> : null
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e6ef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  patternsContainer: {
    marginTop: 8,
  },
  patternItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
});

export default EmotionalSpendingAnalysis;