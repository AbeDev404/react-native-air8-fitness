import {View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import { useEffect, useRef, useState } from 'react';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import MyWorkoutScreen from './my.workouts';
import AirReadyWorkoutScreen from './air8.ready.workouts';
import NewWorkoutScreen from './new.workouts';

import Loading from '../../../components/loading';
import ExerciseItem from '../../../components/exercise.item'
import Colors from '../../../assets/styles/colors';
import GlobalStyle from '../../../assets/styles/global.style'
import BottomNavigator from '../../../components/bottom.navigator'

const HomeScreen = ({route, navigation}) => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(1)
    const [editable_workout, setEditableWorkout] = useState(false);

    useEffect(() => {
        if(route.params.type === 'my.workouts') setType(1)
        if(route.params.type === 'air8.ready.workouts') setType(2)
        if(route.params.type === 'new.workouts') setType(3)
    }, [route.params])

    const onEdit = (e) => {
        setEditableWorkout(e)
    }

    const onBack = () => {
        if(editable_workout) {
            setEditableWorkout(e => !e)
        } else {
            navigation.pop()
        }
    }

    return (
        <AlertNotificationRoot>
            <View style={[GlobalStyle.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
                <View style={[GlobalStyle.flex('row', 'center', 'center'), Styles.menu, GlobalStyle.round, GlobalStyle.BoxShadow]}>
                    <TouchableOpacity style={{position: 'absolute', left: -20}} onPress={onBack}>
                        <MaterialIcons name="arrow-back-ios" size={20} color={Colors.DarkGreen} />
                    </TouchableOpacity>
                    <Pressable onPress={() => setType(1)} style={[GlobalStyle.round, Styles.menuItem1, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 1 && Styles.activeMenuItem]}>
                        <Text style={[GlobalStyle.ManjariBold, Styles.label, type === 1 && Styles.activeLabel]}>{`My\nWorkouts`}</Text>
                    </Pressable>
                    <Pressable onPress={() => setType(2)} style={[GlobalStyle.round, Styles.menuItem2, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 2 && Styles.activeMenuItem, ]}>
                        <Text style={[GlobalStyle.ManjariBold, Styles.label, type === 2 && Styles.activeLabel]}>{`Air8 Ready\nWorkouts`}</Text>
                    </Pressable>
                    <Pressable onPress={() => setType(3)} style={[GlobalStyle.round, Styles.menuItem3, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 3 && Styles.activeMenuItem, ]}>
                        <Text style={[GlobalStyle.ManjariBold, Styles.label, type === 3 && Styles.activeLabel]}>{`Add New\nWorkouts`}</Text>
                    </Pressable>
                </View>

                <View style={[Styles.container, type !== 1 && Styles.invisible]}>
                    <MyWorkoutScreen editable_workout={editable_workout} navigation={navigation} onEdit={onEdit} />
                </View>

                <View style={[Styles.container, type !== 2 && Styles.invisible]}>
                    <AirReadyWorkoutScreen />
                </View>

                <View style={[Styles.container, type !== 3 && Styles.invisible]}>
                    <NewWorkoutScreen params={route.params} navigation={navigation} />
                </View>
                
                <Loading loading={loading} />
                { type !== 3 && type !== 1 && (<BottomNavigator route={route} navigation={navigation} />) }
            </View>
        </AlertNotificationRoot>
    )
}

const Styles = new StyleSheet.create({
    item: {
        width: GlobalStyle.SCREEN_WIDTH * 0.8,
        heigth: 50,
        backgroundColor: 'white',
        position: 'relative',
        marginBottom: 50,
    },
    activeCategory: {
        backgroundColor: Colors.MainGreen
    },
    normalCategory: {
        backgroundColor: 'white'
    },  
    label: {
        height: GlobalStyle.SCREEN_HEIGHT / 15,
        color: Colors.DarkGreen,
        paddingHorizontal: 20,
        fontSize: 15,
        fontWeight: 600,
        textAlign: 'left',
        width: GlobalStyle.SCREEN_WIDTH / 3
    },
    activeLabel: {
        color: 'white'
    },
    menu: {
        marginTop: GlobalStyle.SCREEN_HEIGHT / 30,
        width: '85%',
        marginLeft: GlobalStyle.SCREEN_WIDTH * 0.05,
        height: GlobalStyle.SCREEN_HEIGHT / 15,
    },
    activeMenuItem: {
        backgroundColor: Colors.MainGreen
    },
    menuItem: {
        flexGrow: 0.5,
        paddingTop: 5,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: Colors.MainGreen,
        backgroundColor: 'white',
    },
    selector: {
        width: '50%',
        position: 'absolute', 
        backgroundColor: Colors.MainGreen, 
        height: '100%', 
        left: '0%', 
        flexGrow: 0.1,
        borderRadius: 30,
    },
    categoryItem: {
        marginRight: 10,
        borderColor: Colors.MainGreen,
        borderStyle: 'solid',
        borderWidth: 1.5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    categoryList: {
        marginTop: 20,
        width: '90%',
        height: GlobalStyle.SCREEN_HEIGHT / 20
    },
    categoryLabel: {
        color: Colors.DarkGreen,
        fontWeight: 400,
        fontSize: 15,
        paddingTop: 10,
        paddingBottom: 10,
    },
    exerciseContainer: {
        paddingTop: 20,
        paddingBottom: 80,
    },
    menuItem1: {
        position: 'absolute',
        left: 0,
        zIndex: 0,
        width: GlobalStyle.SCREEN_WIDTH * 0.35,
    },
    menuItem2: {
        position: 'absolute',
        left: GlobalStyle.SCREEN_WIDTH * 0.5 - GlobalStyle.SCREEN_WIDTH * 0.25,
        zIndex: 1,
        width: GlobalStyle.SCREEN_WIDTH * 0.35
    },
    menuItem3: {
        position: 'absolute',
        right: 0,
        zIndex: 2,
        width: GlobalStyle.SCREEN_WIDTH * 0.35,
    },
    container: {
        marginTop: 20,
        height: GlobalStyle.SCREEN_HEIGHT - GlobalStyle.SCREEN_HEIGHT / 15 - GlobalStyle.SCREEN_HEIGHT / 15,
    },
    invisible: {
        opacity: 0,
        position: 'absolute',
        left: -100000
    }
});

export default HomeScreen;