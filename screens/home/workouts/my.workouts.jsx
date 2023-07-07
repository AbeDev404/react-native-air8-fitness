import {useState, useEffect} from 'react'
import LottieView from 'lottie-react-native'
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';

import EditText from '../../../components/edittext'
import useGetWorkouts from '../../../hooks/useGetWorkouts'
import GlobalStyle from '../../../assets/styles/global.style'
import Colors from '../../../assets/styles/colors'
import Alarm from '../../../assets/drawables/alarm.json'
import Loading from '../../../components/loading'
import useExercise from '../../../hooks/useExercise'
import EditWorkout from './new.workouts';
import useFitnessCategory from '../../../hooks/useFitnessCategory'

const MyWorkoutScreen = ({navigation, onEdit, editable_workout}) => {
    const [category, fetchFitnessCategoryData] = useFitnessCategory();
    const [_exercise, getExercise] = useExercise();
    const [_loading, setLoading] = useState(false);
    const [workouts, workoutNames, loading, getWorkouts] = useGetWorkouts();
    const [data, setData] = useState(null)

    useEffect(() => {
        getWorkouts();
        fetchFitnessCategoryData();
    }, [])

    const str_pad_left = (string, pad, length) => {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    const onEditWorkout = async (workout, name) => {
        let exercises = [{}];
        setLoading(true);
        for(let i = 0 ; i < workout.uids.length ; i++) {
            let data = await getExercise(workout.uids[i])
            let item = {
                breakTime: workout.break_times[i],
                category: category,
                data: data,
                uid: workout.uids[i],
                workoutTime: workout.workout_times[i]
            }
            exercises.push(item)
        }
        let t = {
            data: exercises,
            type: 'edit.workouts',
            name: name
        }
        setData(t);
        onEdit(true);
        setLoading(false);
    }
    const onClose = () => {
        onEdit(false);
        setData(null)
    }
    const onPlayWorkout = async (workout, name) => {
        let exercises = [];
        setLoading(true);
        for(let i = 0 ; i < workout.uids.length ; i++) {
            let data = await getExercise(workout.uids[i])
            let item = {
                breakTime: workout.break_times[i],
                category: category,
                data: data,
                uid: workout.uids[i],
                workoutTime: workout.workout_times[i]
            }
            exercises.push(item)
        }
        setLoading(false);
        navigation.push('Workout', {
            data: exercises,
            name: name
        })
    }

    return (
        <View style={[Styles.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
            <ScrollView contentContainerStyle={[{paddingTop: 15, paddingBottom: 80}]} style={{width: GlobalStyle.SCREEN_WIDTH}}>
                {workoutNames.map((key, index, array) => {
                    const item = workouts[index]
                    
                    if(item !== undefined ) {
                        let fitnessTime = 0, officeTime = 0, breakTime = 0;
                        const fitnessCount = item.types.filter((item, index, array) => item.indexOf('fitness') >= 0).length
                        const officeCount = item.types.filter((item, index, array) => item.indexOf('office') >= 0).length

                        for(let i = 0 ; i < (fitnessCount + officeCount) ; i++) {
                            if(item.types[i].indexOf('fitness') >= 0) fitnessTime += item.workout_times[i];
                            if(item.types[i].indexOf('office') >= 0) officeTime += item.workout_times[i];
                            breakTime += item.break_times[i];
                        }
                    return (
                        <View key={key} style={[GlobalStyle.BoxShadow, GlobalStyle.round, Styles.panel]}>
                            <EditText editable={false} value={key} placeholder="Enter Your New Workout Name" />
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
                            <View style={[GlobalStyle.flex('row', 'space-around', 'center')]}>
                                <TouchableOpacity onPress={() => onPlayWorkout(item, key)} style={[{width: 40, height: 40, backgroundColor: 'orangered'}, GlobalStyle.flex('row', 'center', 'center'), GlobalStyle.round, GlobalStyle.BoxShadow]}>
                                    <FontAwesome5 name="play" size={15} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onEditWorkout(item, key)} style={[Styles.saveButton, GlobalStyle.round, GlobalStyle.BoxShadow]}>
                                    <Text style={[GlobalStyle.Manjari, Styles.label1]}>Edit Workouts</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                    }
                })}
            </ScrollView>
            <Loading loading={loading || _loading} />
            { editable_workout && data && (
                <View style={{position:'absolute', width: GlobalStyle.SCREEN_WIDTH, height: '100%', top:0, left: 0, backgroundColor: Colors.BGlight}}>
                    <EditWorkout params={data} navigation={navigation} onClose={onClose} />
                </View>
            ) }
        </View>
    )
}

const Styles = new StyleSheet.create({
    container: {
        width: GlobalStyle.SCREEN_WIDTH,
        height: '100%',
        paddingHorizontal: GlobalStyle.SCREEN_WIDTH * 0.05,
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
        fontSize: GlobalStyle.SCREEN_WIDTH / 30,
    },
    saveButton: {
        backgroundColor: Colors.MainGreen,
        width: '80%',
        paddingVertical: 8
    },
    label1: {
        textAlign: 'center',
        width: '100%',
        fontSize: GlobalStyle.SCREEN_WIDTH / 30,
        color: 'white'
    },
})

export default MyWorkoutScreen