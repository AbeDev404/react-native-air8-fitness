import {View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import { useEffect, useRef, useState } from 'react';
import { AlertNotificationRoot, ALERT_TYPE, Toast } from 'react-native-alert-notification';
import LottieView from 'lottie-react-native'
import { Video, ResizeMode } from 'expo-av';
import * as Progress from 'react-native-progress';
import Carousel from 'react-native-snap-carousel';
import { Feather, MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons';

import ExerciseItem from '../../../components/exercise.item';
import BottomNavigator from '../../../components/bottom.navigator';
import Loading from '../../../components/loading';
import Colors from '../../../assets/styles/colors';
import GlobalStyle from '../../../assets/styles/global.style'
import Alarm from '../../../assets/drawables/alarm.json'

const WorkoutScreen = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);
    const [workoutTime, setWorkoutTime] = useState(0);
    const [time, setTime] = useState(0);
    const [index, setIndex] = useState(0);
    const [name, setName] = useState('')
    const [videoUri, setVideoUri] = useState('')
    const setupVideo = useRef();
    const [_interval, _setInterval] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [playType, setPlayType] = useState('workoutTime');
    const [progress, setProgress] = useState(0.01);
    const _carousel = useRef();

    const onPlaybackStatusUpdate = (status) => {

    }

    useEffect(() => {
        console.log(route.params, setupVideo)
        setWorkoutTime(0);
        setExercises(route.params.data)
        setName(route.params.name)
        setVideoUri(route.params.data[index].data.video_url)
        
        for(let i = 0 ; i < route.params.data.length ; i++) {
            setWorkoutTime(e => e + route.params.data[i].breakTime + route.params.data[i].workoutTime)
        }

        setLoading(false);

        return () => {
            if(_interval) clearInterval(_interval)
        }
    }, [])

    useEffect(() => {
        if(playing) {
            setupVideo.current.playAsync();
            setPlaying(true);
            let t = setInterval(() => {
                setWorkoutTime(e => e - 1);
                setTime(e => e + 1)
            }, 1000)
            _setInterval(t);
        } else {
            setupVideo.current.pauseAsync();
            setPlaying(false);
            clearInterval(_interval)
            _setInterval(null);
        }
    }, [playing])

    const renderTimer = () => {
        return (
            <TouchableOpacity onPress={() => setPlaying(e => !e)} style={[GlobalStyle.flex('row', 'center', 'center')]}>
                {!playing && (<Feather name="play" size={8} color='transparent' />)} 
                <Feather name={playing ? 'pause' : 'play'} size={32} color={Colors.MainGreen} />
            </TouchableOpacity>
            // <Text style={[GlobalStyle.ManjariBold, {fontSize: 20}]}>00:00</Text>
        )
    }

    const str_pad_left = (string, pad, length) => {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    useEffect(() => {
        if(exercises.length > 0) {
            setProgress(time / exercises[index][playType])
            if(time === exercises[index][playType]) {
                // setPlaying(e => !e);
                if(playType === 'workoutTime') {
                    if(exercises[index].breakTime === 0) {
                        setPlayType('workoutTime')
                        setVideoUri(exercises[index + 1].data.video_url)
                        setIndex(e => e + 1)
                    } else {
                        setVideoUri(exercises[index + 1].data.setup_video_url)
                        setPlayType('breakTime')
                    }
                } else if(playType === 'breakTime') {
                    setPlayType('workoutTime')
                    setVideoUri(exercises[index + 1].data.video_url)
                    setIndex(e => e + 1)
                }
                setTime(0);
            }
        }
    }, [time])

    const onNext = () => {
        if(index < exercises.length - 1) {
            setPlaying(false);
            // setWorkoutTime(e => e - exercises[index].breakTime - exercises[index].workoutTime)
            setIndex(e => e + 1)
            _carousel.current.snapToItem(index + 1);
        }
    }

    const onPrevious = () => {
        if(index > 0) {
            setPlaying(false);
            // setWorkoutTime(e => e + exercises[index].breakTime + exercises[index].workoutTime - time)
            setIndex(e => e - 1)
            _carousel.current.snapToItem(index - 1);
        }
    }

    const onSnapToItem = (snapIndex) => {
        if(exercises.length > 0) {
            let e = 0;
            for(let i = 0 ; i < exercises.length ; i++) {
                if(i >= snapIndex) {
                    e += exercises[i].breakTime + exercises[i].workoutTime
                }
            }
            setWorkoutTime(e)
            setIndex(snapIndex)
        }
    }

    useEffect(() => {
        setTime(0);
        _carousel?.current?.snapToItem(index);
        setPlayType('workoutTime')
    }, [index])

    const renderTime = () => {
        return (
            <Text style={{position:'absolute'}}>BreakTime 00:00</Text>
        )
    }

    return (
        <AlertNotificationRoot> 
            <View style={[GlobalStyle.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
                <View style={[GlobalStyle.flex('row', 'space-between', 'center'), Styles.menu]}>
                    <TouchableOpacity onPress={() => navigation.pop()}>
                        <MaterialIcons name="arrow-back-ios" size={20} color={Colors.DarkGreen} />
                    </TouchableOpacity>
                    <View style={[GlobalStyle.flex('row', 'center', 'center'), GlobalStyle.round]}>
                        {/* <LottieView source={Alarm} style={{width: 80}} autoPlay loop /> */}
                        <Text style={[GlobalStyle.ManjariBold, Styles.title]}>{name}</Text>
                    </View>
                    <Text style={[GlobalStyle.ManjariBold, Styles.label]}>{index + 1} / {exercises.length}</Text>
                </View>
                <View style={[GlobalStyle.flex('row', 'space-between', 'center')]}>
                    <MaterialCommunityIcons name="timer" size={32} color={Colors.MainGreen} />
                    <Text style={[GlobalStyle.ManjariBold, Styles.label, {marginLeft: 20}]}>{str_pad_left(Math.floor(workoutTime / 60), '0', 2) + ':' + str_pad_left(workoutTime % 60, '0', 2)}</Text>
                </View>

                <View style={[Styles.videoContainer, GlobalStyle.BoxShadow, GlobalStyle.round, { marginBottom: 30 }]}>
                    <Video
                        ref={setupVideo}
                        style={Styles.video}
                        source={{ uri: videoUri }}
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        useNativeControls
                        onLoadStart={() => setLoading(true)}
                        onLoad={() => setLoading(false)}
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    />
                    {/* {renderTime()} */}
                </View>
                { !loading && (
                    <View style={[GlobalStyle.flex('row', 'center', 'center', {width: GlobalStyle.SCREEN_WIDTH})]}>
                        <Carousel
                            ref={_carousel}
                            data={exercises}
                            contentContainerStyle={[GlobalStyle.flex('row', 'center', 'center')]}
                            renderItem={({item, _index}) => 
                                <View style={[GlobalStyle.flex('row', 'center', 'center')]}>
                                    <ExerciseItem addable={false} data={item.data} category={item.category} uid={item.uid} navigation={navigation} /> 
                                </View>
                            }
                            layout='stack'
                            sliderWidth={GlobalStyle.SCREEN_WIDTH}
                            itemWidth={GlobalStyle.SCREEN_WIDTH}
                            onSnapToItem={onSnapToItem}
                        />
                    </View>          
                )  }
                {/* <ExerciseItem addable={false} data={exercises[_index].data} category={exercises[_index].category} uid={exercises[_index].uid} navigation={navigation} /> */}
                <View style={[GlobalStyle.flex('row', 'center', 'center'), { width: '90%', paddingVertical: 10, position: 'absolute', bottom: 30, backgroundColor: 'transparent' }]}>
                    <TouchableOpacity onPress={onPrevious}>
                        <Feather name="skip-back" size={32} color={Colors.MainGreen} />
                    </TouchableOpacity>
                    <Progress.Circle animated={true} style={{marginHorizontal: 20, borderWidth: 2, borderRadius: 100, borderColor: Colors.MainGreen}} strokeCap='round' color={Colors.MainGreen} size={80} thickness={5} indeterminate={false} progress={progress} showsText={true} formatText={renderTimer} />
                    <TouchableOpacity onPress={onNext}>
                        <Feather name="skip-forward" size={32} color={Colors.MainGreen} />
                    </TouchableOpacity>
                </View>

                <Loading loading={loading} />
                {/* <BottomNavigator route={route} navigation={navigation} /> */}
            </View>
        </AlertNotificationRoot>
    )
}

const Styles = new StyleSheet.create({
    menu: {
        width: '90%',
        marginTop: GlobalStyle.SCREEN_HEIGHT / 30,
    },
    label: {
        color: Colors.DarkGreen,
        fontSize: 20,
        fontWeight: 600,
    },
    videoContainer: {
        width: GlobalStyle.SCREEN_WIDTH * 0.9,
        height: GlobalStyle.SCREEN_WIDTH * 0.75,
        backgroundColor: 'white',
        marginTop: 20,
    },
    video: {
        width: '100%',
        height: '100%'
    },
    title: {
        color: Colors.DarkGreen,
        fontSize: 30,
        fontWeight: 600,
    }
});

export default WorkoutScreen;