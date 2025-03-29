import { ThemedView } from "@/components/ThemedView";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/fr';
import Constants from 'expo-constants';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CurveType, LineChart, PieChart } from "react-native-gifted-charts";

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
          key={index} 
          style={[selectedMonth === month ? styles.activeMonthContainer : styles.monthContainer]}>
            <Text style={{alignSelf: 'center', color : selectedMonth === month ? '' : '#D9D9D9' }} >{month.locale('fr').format('MMMM').length > 4 ? month.locale('fr').format('MMMM').slice(0, 3) : month.locale('fr').format('MMMM').slice(0, 4)}</Text>
            <Text style={{alignSelf: 'center', color : selectedMonth === month ? '' : '#D9D9D9' }} >{month.locale('fr').format('YYYY')}</Text>
          </View>
        ))}
      </ScrollView>
        {
          isLoading ? (
            <Text style={{color:'#D9D9D9'}}>Loading...</Text>
          ) : (
            <ScrollView contentContainerStyle={{display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 50, paddingLeft: 22, paddingRight: 22}}>
              <Text style={{color: '#D9D9D9', fontSize: 20, marginTop: 15}}>Heures d'entrainement</Text>
              <Text style={{color: '#C6FF00', fontSize: 40,marginBottom: 20, fontWeight: 'bold', }}>{totalHours} h</Text>
              <Text style={{color: '#D9D9D9', fontSize: 20, marginTop: 10, marginBottom: 10}}>Statistiques</Text>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap : 14, width: '100%', justifyContent: 'space-between'}}>

                {/* Calories donut */}
                
                <Text style={{color: '#D9D9D9', fontSize : 14, textDecorationLine : 'underline', alignSelf : 'flex-start'}}>Total des calories du mois</Text>
                <View style={{ display :'flex', flexDirection : 'row', alignItems: 'center', padding : 12, gap : 8 , minWidth: '100%', height: 150, backgroundColor: '#1E2021', borderRadius : 12 , borderWidth: 1 , borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                    <PieChart 
                    innerCircleColor={'#1E2021'}
                    innerRadius={30}
                    centerLabelComponent={()=> {
                      return (
                        <Text style={{color: '#D9D9D9', fontSize: 20}}>{totalCalories}</Text>
                      )
                    }}
                    radius={50}
                    textSize={20}
                    data={totalCalories > 0 ? [{value: totalCalories }] : [{ value : 1}]} />
                    <Text style={{color: '#D9D9D9', fontSize: 14, marginLeft : 10}}>{totalCalories > 0 ? 'Calories' : 'Aucune calorie ce mois ci'}</Text>
                </View>             
                {/* Trainings types donut */}
                <Text style={{color: '#D9D9D9', fontSize : 14, textDecorationLine : 'underline',alignSelf : 'flex-start' }}>Total types des séances du mois</Text>
                <View style={{ display :'flex', flexDirection : 'row', alignItems: 'center', padding : 12 , gap : 8 , minWidth: '100%', height: 150, backgroundColor: '#1E2021', borderRadius : 12 , borderWidth: 1 , borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                    <PieChart 
                    innerCircleColor={'#1E2021'}
                    innerRadius={30}
                    centerLabelComponent={()=> {
                      return (
                        <Text style={{color: '#D9D9D9', fontSize: 20}}>{
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
                          <Text style={{color: '#D9D9D9', fontSize: 16}}>{training.type.charAt(0).toUpperCase() + training.type.slice(1)} : {training.count}</Text>
                        </View>
                      )) : <Text style={{color: '#D9D9D9', fontSize: 16}}>Aucune séance ce mois ci</Text>}
                    </View>
                </View>
                {/* Line Chart */}
                <Text style={{color: '#D9D9D9', fontSize : 14, textDecorationLine : 'underline', alignSelf : 'flex-start' }}>Suivis des calories</Text>
                <View style={{ display :'flex', flexDirection : 'row', alignItems: 'center', padding : 12 , gap: 8, minWidth: '100%', height: 'auto', backgroundColor: '#1E2021', borderRadius : 12 , borderWidth: 1 , borderColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden'}}>
                    <LineChart
                      initialSpacing={1}
                      data={
                        trainingOverDays
                      }
                      hideRules
                      curved 
                      yAxisColor="#405203"
                      xAxisColor="#405203"
                      showVerticalLines
                      verticalLinesColor="#405203"
                      xAxisLabelTextStyle={{color: '#ffffff'}}
                      curveType={CurveType.QUADRATIC}
                      yAxisTextStyle={{color: '#ffffff'}}
                      isAnimated 
                      hideDataPoints
                      // lineColor
                      color="#C6FF00"
                      thickness={5}
                    />
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
    // padding: 32,
    paddingTop: 32,
    paddingBottom: 32,
    minHeight: '100%',
  },
  scrollContainer: {
    marginTop: 20,
    minHeight: 50,
    },
  monthContainer: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#212121',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 50,
    maxHeight: 50,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
    gap: 5,
  },
  activeMonthContainer: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#C6FF00',
    borderRadius: 5,
    minHeight: 50,
    maxHeight: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 5,
  },
});