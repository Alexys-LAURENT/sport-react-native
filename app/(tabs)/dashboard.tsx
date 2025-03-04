import { ThemedView } from "@/components/ThemedView";
import dayjs, { Dayjs } from "dayjs";
import Constants from 'expo-constants';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

// TODO : change this to the current user id
const ID_USER = 1
const API_URL = Constants.expoConfig?.extra?.API_URL;
type CountTrainingsTypes = {
  type: string;
  count: number;
  color:string;
}

type CaloriesOverDays = {
  date: string;
  calories: number;
}

type CaloriesOverDaysFormatted = {
  label: string;
  value: number;
}

export default function DashboardScreen() {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>()
  const [months, setMonths] = useState<Dayjs[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // states for graphs
  const [totalCalories, setTotalCalories] = useState(0)
  const [countTrainningsTypes, setCountTrainningsTypes] = useState<CountTrainingsTypes[]>([])
  const [trainingOverDays, setTrainingOverDays] = useState<CaloriesOverDaysFormatted[]>([])
  const [totalHours, setTotalHours] = useState(0)

  useEffect(() => {

  const getLastMonths = (total:number) => {
    // If you want the last 12 months, put 11
    const months = [];
    for (let i = total; i >= 0; i--) {
      const date = dayjs().subtract(i, 'month');
      months.push(date);
      
      if(i === 0) {
        console.log(date);
        setSelectedMonth(date)
      }
    }
    return months;
  };

  setMonths(getLastMonths(11))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const month = selectedMonth?.get('M')
        const year = selectedMonth?.get('y')

        if(month === undefined || year === undefined) {
          return
        }
        
        const res =  await fetch(API_URL+`api/dashboard/${ID_USER}/${month+1}/${year}`)
        
        const data = await res.json()

        if(data.calories !== undefined && data.dailyCalories !== undefined && data.trainings !== undefined && data.totalHours !== undefined) {
          setTotalCalories(data.calories)
          setTotalHours(data.totalHours)
          let formatedTrainingOverDays: CaloriesOverDaysFormatted[] = []
          data.dailyCalories.forEach((daily: CaloriesOverDays ) => {
            const label = dayjs(daily.date).format('DD')
            const value = daily.calories
            formatedTrainingOverDays.push({label, value})
          });
          setTrainingOverDays(formatedTrainingOverDays)
          setCountTrainningsTypes(data.trainings)
          setIsLoading(false)
        }
      } catch (error) {
        console.log('dashboard.tsx ',error);
      }
    }
    fetchData()
  }, [selectedMonth])


  return (
    <ThemedView style={styles.mainContainer}>
      <ScrollView horizontal style={styles.scrollContainer}>
        {months.map((month, index) => (
          <View
          onTouchEnd={() => setSelectedMonth(month)}
          key={index} style={[selectedMonth === month ? styles.activeMonthContainer : styles.monthContainer]}>
            <Text>{
              month.format('MMMM YYYY')
          }</Text>
          </View>
        ))}
      </ScrollView>
        {
          isLoading ? (
            <Text style={{color:'white'}}>Loading...</Text>
          ) : (
            <ScrollView contentContainerStyle={{display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 50}}>
              <Text style={{color: 'white', fontSize: 20, marginTop: 10}}>Heures d'entrainement</Text>
              <Text style={{color: '#C6FF00', fontSize: 40,marginBottom: 20, fontWeight: 'bold', }}>{totalHours} h</Text>
              <Text style={{color: 'white', fontSize: 20, marginTop: 10, marginBottom: 10}}>Statistiques</Text>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap : 14, width: '100%', justifyContent: 'space-between'}}>

                {/* Calories donut */}
                
                <View style={{ display :'flex', flexDirection : 'column', padding : 12, gap : 8 , minWidth: '100%', height: 150, backgroundColor: '#1E2021', borderRadius : 12 , borderWidth: 1 , borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                <Text style={{color: 'white', fontSize : 14, textDecorationLine : 'underline', }}>Total des calories du mois</Text>
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <PieChart 
                    innerCircleColor={'#1E2021'}
                    innerRadius={30}
                    centerLabelComponent={()=> {
                      return (
                        <Text style={{color: 'white', fontSize: 20}}>{totalCalories}</Text>
                      )
                    }}
                    radius={50}
                    textSize={20}
                    data={totalCalories > 0 ? [{value: totalCalories }] : [{ value : 1}]} />
                    <Text style={{color: 'white', fontSize: 14, marginLeft : 10}}>{totalCalories > 0 ? 'Calories' : 'Aucune calorie ce mois ci'}</Text>
                  </View>
                </View>             
                {/* Trainings types donut */}
                <View style={{ display :'flex', flexDirection : 'column', padding : 12 , gap : 8 , minWidth: '100%', height: 150, backgroundColor: '#1E2021', borderRadius : 12 , borderWidth: 1 , borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                <Text style={{color: 'white', fontSize : 14, textDecorationLine : 'underline', }}>Total types des séances du mois</Text>
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <PieChart 
                    innerCircleColor={'#1E2021'}
                    innerRadius={30}
                    centerLabelComponent={()=> {
                      return (
                        <Text style={{color: 'white', fontSize: 20}}>{
                          countTrainningsTypes.length > 0 ? countTrainningsTypes.reduce((acc, curr) => acc + curr.count, 0) : 0
                        }</Text>
                      )
                    }}
                    radius={50}
                    data={countTrainningsTypes.length > 0 ? countTrainningsTypes.map((training)=> ({value: training.count, text: training.type, color: training.color})) : [{ value : 1, text : 'Aucune séance ce mois ci'}]} />
                    <View style={{display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 10}}>
                      {countTrainningsTypes.length > 0 ? countTrainningsTypes.map((training, index) => (
                        <View key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                          <View style={{width: 10, height: 10, backgroundColor: training.color, borderRadius: 5}}></View>
                          <Text style={{color: 'white', fontSize: 16}}>{training.type.charAt(0).toUpperCase() + training.type.slice(1)} : {training.count}</Text>
                        </View>
                      )) : <Text style={{color: 'white', fontSize: 16}}>Aucune séance ce mois ci</Text>}
                    </View>
                  </View>
                </View>
                {/* Line Chart */}
                <View style={{ display :'flex', flexDirection : 'column', padding : 12 , gap: 8, minWidth: '100%', height: 'auto', backgroundColor: '#1E2021', borderRadius : 12 , borderWidth: 1 , borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                <Text style={{color: 'white', fontSize : 14, textDecorationLine : 'underline', }}>Suivis des calories</Text>
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <LineChart
                      initialSpacing={0}
                      data={
                        trainingOverDays
                      }
                      hideRules
                      yAxisColor="#C6FF00"
                      xAxisColor="#C6FF00"
                      showVerticalLines
                      verticalLinesColor="#C6FF00"
                      xAxisLabelTextStyle={{color: '#ffffff', transform: [{translateX: 7}]}}
                      yAxisTextStyle={{color: '#ffffff'}}
                      // lineColor
                      color="#C6FF00"
                      thickness={5}
                    />
                  </View>
                </View>

            </View>
            </ScrollView>
          )
        }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 32,
    minHeight: '100%',
  },
  scrollContainer: {
    marginTop: 20,
    height: 40,
    maxHeight: 40,
  },
  monthContainer: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    height: 35,
  },
  activeMonthContainer: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#C6FF00',
    borderRadius: 5,
    height: 35,
  },
});