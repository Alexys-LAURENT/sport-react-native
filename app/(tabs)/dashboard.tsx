import { ThemedView } from "@/components/ThemedView";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>()
  const [months, setMonths] = useState<Dayjs[]>([])
  useEffect(() => {

  const getLastSixMonths = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = dayjs().subtract(i, 'month');
      months.push(date);
      
      if(i === 5) {
        console.log(date);
        setSelectedMonth(date)
      }
    }
    return months;
  };

  setMonths(getLastSixMonths())
  }, [])


  return (
    <ThemedView style={styles.mainContainer}>
      <ScrollView horizontal style={styles.scrollContainer}>
        {months.toReversed().map((month, index) => (
          <View
          onTouchEnd={() => setSelectedMonth(month)}
          key={index} style={[selectedMonth === month ? styles.activeMonthContainer : styles.monthContainer]}>
            <Text>{
              month.format('MMMM YYYY')
          }</Text>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    padding: 32,
  },
  scrollContainer: {
    marginTop: 20,
    maxHeight: 'auto',
  },
  monthContainer: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  activeMonthContainer: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});