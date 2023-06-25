import {useState, useEffect, useCallback, useRef, useMemo} from 'react'
import {Animated, View, Text, TouchableOpacity, StyleSheet, Image, Easing, Platform} from 'react-native'
import LottieView from 'lottie-react-native'
import SortableList from 'react-native-sortable-list';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { MaterialIcons } from '@expo/vector-icons';

import useStoreWorkouts from '../../../hooks/useStoreWorkouts';
import WorkoutExerciseItem from '../../../components/workout.exercise';
import BreakTimer from '../../../components/break.timer'
import EditText from '../../../components/edittext'
import GlobalStyle from '../../../assets/styles/global.style'
import Colors from '../../../assets/styles/colors'
import Alarm from '../../../assets/drawables/alarm.json'
import { ScrollView } from 'react-native-gesture-handler';
import Loading from '../../../components/loading';

const Row = ({type, index, active, data, onChangeBreakTimer, onChangeWorkoutTimer, onRemoveExercise}) => {    
  const activeAnim = useRef(new Animated.Value(0));

  const style = useMemo(
    () => ({
      transform: [
        { scaleX: activeAnim.current.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05]}) },
        { scaleY: activeAnim.current.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05]}) },
      ],
    })
  );
  useEffect(() => {
    Animated.timing(activeAnim.current, {
      duration: 300,
      easing: Easing.bounce,
      toValue: Number(active),
      useNativeDriver: true,
    }).start();
  }, [active]);

  let workoutTimeType = 1;
  if(data.workoutTime === 30) workoutTimeType = 1;
  if(data.workoutTime === 60) workoutTimeType = 2;
  if(data.workoutTime === 90) workoutTimeType = 3;

  let breakTimeType = 1;
  if(data.breakTime === 10) breakTimeType = 1;
  if(data.breakTime === 30) breakTimeType = 2;
  if(data.breakTime === 60) breakTimeType = 3;

  if(type !== 'edit.workouts') {
    if(index === 0 || (index + 1) % 4 !== 0) {
      breakTimeType = 0;
      onChangeBreakTimer(data.uid, 0)
    }
  } else {
    if(index === 0 || index % 4 !== 0) {
      breakTimeType = 0;
      onChangeBreakTimer(data.uid, 0)
    }
  }

  return (
    <Animated.View useNativeDriver={true} style={[{width: '100%'}, GlobalStyle.flex('column', 'center', 'flex-start'), style]}>
      <WorkoutExerciseItem onRemoveExercise={(uid) => onRemoveExercise(uid)} data={data.data} time1={30} time2={60} time3={90} timerType={workoutTimeType} onChangeTimer={(uid, timer) => onChangeWorkoutTimer(uid, timer)} type={workoutTimeType} uid={data.uid} category={data.category} />
      <BreakTimer uid={data.uid} title={`Break\nTime`} onChangeTimer={(uid, timer) => onChangeBreakTimer(uid, timer)} timerType={breakTimeType} time1={10} time2={30} time3={60} containerStyle={{width: '90%', opacity: breakTimeType !== 0 ? 100 : 0}} />
    </Animated.View>
  );
}

const NewWorkoutScreen = ({params, navigation, onClose}) => {
  const [workouts, setWorkouts] = useState([{}])
  const [scrollenabled, setScrollenabled] = useState(true);
  const [fitnessCount, setFitnessCount] = useState(0)
  const [officeCount, setOfficeCount] = useState(0)
  const [fitnessTime, setFitnessTime] = useState(0)
  const [officeTime, setOfficeTime] = useState(0)
  const [breakTime, setBreakTime] = useState(0)
  const [workoutName, setWorkoutName] = useState('');
  const [response, storeWorkouts] = useStoreWorkouts();
  const [order, setOrder] = useState([])
  const _sortableRef = useRef()
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  const onAddExercises = () => {
    navigation.push('ExerciseList', {
        type: 'fitness',
        method: 'get',
        selectedData: workouts,
        callback: callback
    })
  }

  useEffect(() =>{
    updateTimerValue(workouts)
  }, [workouts])

  const updateTimerValue = (_workouts) => {
    let fitness = 0, office = 0;
    let time_fitness = 0, time_office = 0, time_break = 0;
    _workouts.map((item, index, array) => {
      if(Object.keys(item).length > 0) {
        if(item.data.type === 'fitness') fitness++, time_fitness += item.workoutTime
        else office++, time_office += item.workoutTime
        time_break += item.breakTime
      }
    })
    setFitnessCount(fitness)
    setOfficeCount(office)

    setFitnessTime(time_fitness)
    setOfficeTime(time_office)
    setBreakTime(time_break)
  }

  const callback = (data) => setWorkouts(data) 
  useEffect(() => {
    !flag && params.data?.length > 0 && setWorkouts(params.data), setFlag(true);
  }, [])

  const onChangeBreakTimer = (uid, timer) => {
    let t = workouts;
    let pos = t.findIndex((item, index, array) => item.uid === uid);
    if(pos !== -1) {
      t[pos].breakTime = timer;
      updateTimerValue(t)
      setWorkouts(t)
    }
  }
  const onChangeWorkoutTimer = (uid, timer)=> {
    let t = workouts;
    let pos = t.findIndex((item, index, array) => item.uid === uid);
    if(pos !== -1) {
      t[pos].workoutTime = timer;
      updateTimerValue(t)
      setWorkouts(t)
    }
  }
  const onRemoveExercise = (uid) => {
    setWorkouts(array => {
      let t = array.filter((item, index, array) => item.uid !== uid)
      updateTimerValue(t)
      return t;
    });
  }

  const renderRow = useCallback(({key, data, disabled, active, index}) => {
    if(Object.keys(data).length > 0)
      return <Row type={params.type} useNativeDriver={true} index={index} data={data} active={active} onChangeWorkoutTimer={onChangeWorkoutTimer} onChangeBreakTimer={onChangeBreakTimer} onRemoveExercise={onRemoveExercise} />;
  }, []);

  const saveNewWorkouts = () => {
    let t = workouts;
    for(let i = 0; i < t.length ; i++) {
      if(i % 4 !== 0) t[i].breakTime = 0;
    }
    setWorkouts(t);
    if(workoutName === '') {
      Toast.show({ type: ALERT_TYPE.WARNING, title: 'Invalid Input Data', textBody: 'Please Enter Your New Workout Name' })
    } else if(workouts.length < 2) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: 'Invalid Input Data', textBody: 'Please add more than 3 exercises.' })
    } else {
      let uids = [], break_times = [], workout_times = [], types = [];
      _sortableRef.current.state.order.map((item, index, array) => {
        if(item != 0) {
          uids.push(workouts[item].uid);
          types.push(workouts[item].data.type);
          break_times.push(workouts[item].breakTime);
          workout_times.push(workouts[item].workoutTime);
        }
      })
      setLoading(true);
      storeWorkouts('new.workouts', {
        uids: uids,
        types: types,
        break_times: break_times,
        workout_times: workout_times
      }, workoutName).then(result => {
        if(result === 'exist') {
          setLoading(false);
          Toast.show({ type: ALERT_TYPE.WARNING, title: 'Warning Occured', textBody: 'The Workouts Name Already Exists.' })
        } else if(result === 'success') {
          setLoading(false);
          Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Congratulations!', textBody: 'Your Workouts Successfully Added.' })
          setTimeout(() => {
            navigation.replace('Workouts', { type: 'my.workouts' })
          }, 1000)
        }
      }).catch(error => {
        if(error === 'failed') {
          setLoading(false);
          Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error Occured', textBody: 'Please Check Your Network Connection.' })
        }
      })
    }
  }

  const updateNewWorkouts = () => {
    console.log(workouts)
    if(workouts.length < 2) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: 'Invalid Input Data', textBody: 'Please add more than 3 exercises.' })
    } else {
      let uids = [], break_times = [], workout_times = [], types = [];
      _sortableRef.current.state.order.map((item, index, array) => {
        if(item != 0) {
          uids.push(workouts[item].uid);
          types.push(workouts[item].data.type);
          break_times.push(workouts[item].breakTime);
          workout_times.push(workouts[item].workoutTime);
        }
      })
      setLoading(true);
      storeWorkouts(params.type, {
        uids: uids,
        types: types,
        break_times: break_times,
        workout_times: workout_times
      }, params.name).then(result => {
        if(result === 'exist') {
          setLoading(false);
          Toast.show({ type: ALERT_TYPE.WARNING, title: 'Warning Occured', textBody: 'The Workouts Name Already Exists.' })
        } else if(result === 'success') {
          setLoading(false);
          Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Congratulations!', textBody: 'Your Workouts Successfully Added.' })
          setTimeout(() => {
            navigation.replace('Workouts', { type: 'my.workouts' })
          }, 1000)
        }
      }).catch(error => {
        if(error === 'failed') {
          setLoading(false);
          Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error Occured', textBody: 'Please Check Your Network Connection.' })
        }
      })
    }
  }

  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  return (
    <View style={[Styles.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
      {params.type === 'edit.workouts' && (
        <View style={{width: '100%', alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={Colors.DarkGreen} />
          </TouchableOpacity>
        </View>
      )}
      <ScrollView scrollEnabled={scrollenabled} contentContainerStyle={[{paddingTop: 15}]} style={{width: GlobalStyle.SCREEN_WIDTH}}>
        <View style={[GlobalStyle.BoxShadow, GlobalStyle.round, Styles.panel]}>
          <EditText editable={params.type === 'edit.workouts' ? false : true} value={params.type === 'edit.workouts' ? params.name : workoutName} onChange={(e) => setWorkoutName(e)} placeholder="Enter Your New Workout Name" />
          <View style={[GlobalStyle.flex('row', 'space-around', 'center')]}>
              <View style={{flexGrow: 0.7}}>
                  <View style={[GlobalStyle.flex('row', 'space-between', 'center')]}>
                      <Text style={[GlobalStyle.Manjari, Styles.label]}>{fitnessCount} Fitness Exercises</Text>
                      <Text style={[GlobalStyle.ManjariBold, Styles.label]}>{str_pad_left(Math.floor(fitnessTime / 60), '0', 2) + ':' + str_pad_left(fitnessTime % 60, '0', 2)}</Text>
                  </View>
                  <View style={[GlobalStyle.flex('row', 'space-between', 'center')]}>
                      <Text style={[GlobalStyle.Manjari, Styles.label]}>{officeCount} Office Exercises</Text>
                      <Text style={[GlobalStyle.ManjariBold, Styles.label]}>{str_pad_left(Math.floor(officeTime / 60), '0', 2) + ':' + str_pad_left(officeTime % 60, '0', 2)}</Text>
                  </View>
              </View>
              <View style={[GlobalStyle.flex('row', 'center', 'center'), {flexGrow: 0.3}]}>
                  <LottieView source={Alarm} style={{width: 80}} autoPlay loop />
                  <Text style={[GlobalStyle.ManjariBold, Styles.label]}>{str_pad_left(Math.floor((fitnessTime + officeTime + breakTime) / 60), '0', 2) + ':' + str_pad_left((fitnessTime + officeTime + breakTime) % 60, '0', 2)}</Text>
              </View>
          </View>
          {params.type === 'edit.workouts' && (
            <TouchableOpacity onPress={updateNewWorkouts} style={[Styles.saveButton, GlobalStyle.round, GlobalStyle.BoxShadow]}>
              <Text style={[GlobalStyle.Manjari, Styles.label1]}>Update Workouts</Text>
            </TouchableOpacity>
          )}
          {params.type !== 'edit.workouts' && (
            <TouchableOpacity onPress={saveNewWorkouts} style={[Styles.saveButton, GlobalStyle.round, GlobalStyle.BoxShadow]}>
              <Text style={[GlobalStyle.Manjari, Styles.label1]}>Save New Workouts</Text>
            </TouchableOpacity>
          )}
          
        </View>

        <SortableList
          ref={_sortableRef}
          contentContainerStyle={{paddingBottom: 50}}
          style={[Styles.list]}
          data={workouts}
          renderRow={renderRow}
          onActivateRow={() => { console.log(_sortableRef.current); setScrollenabled(false) }}
          onReleaseRow={() => { setScrollenabled(true) }}
        />
      </ScrollView>

      <TouchableOpacity onPress={onAddExercises} style={[Styles.addButton, GlobalStyle.round, GlobalStyle.BoxShadow]}>
          <Text style={[GlobalStyle.Manjari, Styles.buttonLabel]}>Add Exercises</Text>
      </TouchableOpacity>
      <Loading loading={loading} />
    </View>
  )
}

const Styles = new StyleSheet.create({
  container: {
    width: GlobalStyle.SCREEN_WIDTH,
    height: '100%',
    paddingHorizontal: GlobalStyle.SCREEN_WIDTH * 0.05,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: Colors.MainGreen,
    width: GlobalStyle.SCREEN_WIDTH / 2,
    paddingVertical: 8
  },
  buttonLabel: {
    textAlign: 'center',
    width: '100%',
    fontSize: 15,
    color: 'white'
  },
  panel: {
    width: '90%',
    paddingHorizontal: 10,
    marginHorizontal: '5%',
    paddingVertical: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: Colors.MainGreen,
    width: '100%',
    paddingVertical: 8
  },
  label1: {
    textAlign: 'center',
    width: '100%',
    fontSize: 15,
    color: 'white'
  },
  list: {
    marginTop: 10,
    width: '100%',
  },
  
})

export default NewWorkoutScreen