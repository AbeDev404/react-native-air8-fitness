import {View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { AlertNotificationRoot, ALERT_TYPE, Toast } from 'react-native-alert-notification'
import LottieView from 'lottie-react-native'
import { Video, ResizeMode } from 'expo-av'
import * as Progress from 'react-native-progress'
import Carousel from 'react-native-snap-carousel'
import { Feather, MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons'
import { CountdownCircleTimer, useCountdown } from 'react-native-countdown-circle-timer'

import useVideoThumbnails from '../../../hooks/useVideoThumbnails'
import ExerciseItem from '../../../components/exercise.item'
import BottomNavigator from '../../../components/bottom.navigator'
import Loading from '../../../components/loading'
import Colors from '../../../assets/styles/colors'
import GlobalStyle from '../../../assets/styles/global.style'
import Alarm from '../../../assets/drawables/alarm.json'
import CountDownLottie from '../../../assets/drawables/countdown.json'
import CheckMark from '../../../assets/drawables/checkmark.json'

const WorkoutScreen = ({route, navigation}) => {
    const _countdown = useRef(false);
    const [loop, setLoop] = useState(false);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);
    const [workoutTime, setWorkoutTime] = useState(0);
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(0);
    const [index, setIndex] = useState(0);
    const [name, setName] = useState('')
    const [videoUri, setVideoUri] = useState('')
    const setupVideo = useRef();
    const [_interval, _setInterval] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [playType, setPlayType] = useState('preview');
    const [progress, setProgress] = useState(0.01);
    const [duration, setDuration] = useState(0);
    const _carousel = useRef();
    const [uri, generateThumbnail] = useVideoThumbnails()

    const onPlaybackStatusUpdate = (playbackStatus) => {
        if (playbackStatus.didJustFinish) {
            if(playType === 'setup') {
                console.log('setup finished')
                setTime(0)
                setPlayType('workoutLoading')
                setLoop(true);
                setVideoUri(exercises[index].data.video_url)
            }
        }
    }

    useEffect(() => {
        setIndex(0);
        setWorkoutTime(0);
        setExercises(route.params.data)
        setName(route.params.name)
        generateThumbnail(route.params.data[index].data.video_url, 0)
        setVideoUri(route.params.data[index].data.setup_video_url)
        
        for(let i = 0 ; i < route.params.data.length ; i++) {
            setWorkoutTime(e => e + route.params.data[i].workoutTime)
        }

        setLoading(false);

        return () => {
            if(_interval) clearInterval(_interval)
        }
    }, [])

    useEffect(() => {        
        if(playing) {
            let t = setInterval((loading) => {
                if(!loading) {
                    setTime(e => e + 1)
                    setTimer(e => e + 1)
                }
            }, 1000, loading)
            _setInterval(t);
            
            if(playType === 'setup' || playType === 'exercise' || playType === 'workoutLoading') {
                setupVideo.current.playAsync();
            }
        } else {
            setupVideo.current.pauseAsync();
            setPlaying(false);
            clearInterval(_interval)
            _setInterval(null);
        }
    }, [playing])

    useEffect(() => {
        if(playType === 'exericse' && playing) setProgress(time / exercises[index].workoutTime)
        if(time === 5 && playType === 'preview') {
            setTime(0)
            setPlayType('setup')
            setupVideo.current.replayAsync();
        } else if(time === 2 && playType === 'workoutLoading') {
            setTime(0)
            setPlayType('exercise')
            setupVideo.current.playAsync();
        } else if(playType === 'exercise' && time === exercises[index].workoutTime) {
            setTime(0);
            setupVideo.current.pauseAsync();
            setLoop(false);
            setPlayType('checked')
        } else if(time === 5 && playType === 'checked') {
            setupVideo.current.pauseAsync();
            if(index + 1 < exercises.length) setVideoUri(exercises[index + 1].data.setup_video_url)
            setIndex(e => e + 1)
        }
    }, [time])

    const onVideoLoadStart = () => {
        setLoading(true)
        setPlaying(false)
    }
    const onVideoLoad = () => {
        if(playType !== 'exercise') {
            setLoading(false)
            console.log(playType)
            if(playType === 'setup' || playType === 'exercise' || playType === 'workoutLoading') setPlaying(true), setupVideo.current.playAsync();
            // else if(!playing) setPlaying(true)
            if(index > 0) setPlaying(true)
        }
    }

    const renderTimer = () => {
        return (
            <TouchableOpacity onPress={() => setPlaying(e => !e)} style={[GlobalStyle.flex('row', 'center', 'center')]}>
                {!playing && (<Feather name="play" size={8} color='transparent' />)} 
                <Feather name={playing ? 'pause' : 'play'} size={32} color={Colors.MainGreen} />
            </TouchableOpacity>
        )
    }
    const str_pad_left = (string, pad, length) => {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    const onNext = () => {
        if(index < exercises.length - 1) {
            setPlaying(false);
            setWorkoutTime(e => e - exercises[index].breakTime - exercises[index].workoutTime)
            setIndex(e => e + 1)
            _carousel.current.snapToItem(index + 1);
        }
    }

    const onPrevious = () => {
        if(index > 0) {
            setPlaying(false);
            setWorkoutTime(e => e + exercises[index].breakTime + exercises[index].workoutTime - time)
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
        if(index >= exercises.length) {
            setPlaying(false);
        } else {
            setTime(0);
            _carousel?.current?.snapToItem(index);
            setPlayType('preview')
        }
    }, [index])

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
                    { playType === 'preview' && (
                        <Image style={[{width: '100%', height: '100%', resizeMode: 'cover'}, GlobalStyle.round]} source={{uri: uri}} />
                    ) }

                    { !loading && playType === 'preview' && playing && (
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <LottieView style={{justifyContent: 'center', alignItems: 'center', position:'absolute', width: GlobalStyle.SCREEN_WIDTH / 3, height: GlobalStyle.SCREEN_WIDTH / 3 }} source={CountDownLottie} speed={0.2} loop autoPlay>
                                <Text style={[{color: Colors.MainGreen, fontSize: GlobalStyle.SCREEN_WIDTH / 6, textAlign: 'center', paddingTop: GlobalStyle.SCREEN_WIDTH / 12}, GlobalStyle.ManjariBold]}>{5 - time}</Text>
                            </LottieView>
                        </View>)}

                    <Video
                        ref={setupVideo}
                        isLooping={loop}
                        style={[Styles.video, { opacity: playType === 'preview' ? 0 : 1 }]}
                        source={{ uri: videoUri }}
                        resizeMode={ResizeMode.CONTAIN}
                        onLoadStart={onVideoLoadStart}
                        onReadyForDisplay={onVideoLoad}
                        onError={(e) => console.log(e)}
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    />

                    { playType === 'exercise' && playing && (
                        <View style={{position: 'absolute', left: 10, top: 10}}>
                            <LottieView style={{justifyContent: 'center', alignItems: 'center', position:'absolute', width: GlobalStyle.SCREEN_WIDTH / 5, height: GlobalStyle.SCREEN_WIDTH / 5 }} source={CountDownLottie} speed={1 / exercises[index].workoutTime} loop autoPlay>
                                <Text style={[{color: Colors.MainGreen, fontSize: GlobalStyle.SCREEN_WIDTH / 12, textAlign: 'center', paddingTop: GlobalStyle.SCREEN_WIDTH / 24}, GlobalStyle.ManjariBold]}>{exercises[index].workoutTime - time}</Text>
                            </LottieView>
                        </View>)}

                    { playType === 'checked' && playing && (
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <LottieView style={{justifyContent: 'center', alignItems: 'center', position:'absolute', width: GlobalStyle.SCREEN_WIDTH / 2, height: GlobalStyle.SCREEN_WIDTH / 2 }} source={CheckMark} autoPlay loop={false} />
                        </View>)}
                </View>
                <View style={[GlobalStyle.flex('row', 'center', 'center', {width: GlobalStyle.SCREEN_WIDTH})]}>
                    <Carousel
                        ref={_carousel}
                        data={exercises}
                        contentContainerStyle={[GlobalStyle.flex('row', 'center', 'center')]}
                        renderItem={({item, _index}) => 
                            <View style={[GlobalStyle.flex('row', 'center', 'center'), {paddingVertical: 20}]}>
                                <ExerciseItem addable={false} data={item.data} category={item.category} uid={item.uid} navigation={navigation} /> 
                            </View>
                        }
                        layout='stack'
                        sliderWidth={GlobalStyle.SCREEN_WIDTH}
                        itemWidth={GlobalStyle.SCREEN_WIDTH}
                        onSnapToItem={onSnapToItem}
                    />
                </View>
                {/* <ExerciseItem addable={false} data={exercises[_index].data} category={exercises[_index].category} uid={exercises[_index].uid} navigation={navigation} /> */}
                <View style={[GlobalStyle.flex('row', 'center', 'center'), { width: '90%', paddingVertical: 10, position: 'absolute', bottom: 30, backgroundColor: 'transparent' }]}>
                    <TouchableOpacity onPress={onPrevious}>
                        <Feather name="skip-back" size={32} color={Colors.MainGreen} />
                    </TouchableOpacity>
                    <Progress.Circle animated={true} style={{marginHorizontal: 20, borderWidth: 2, borderRadius: 100, borderColor: Colors.MainGreen}} strokeCap='round' color={Colors.MainGreen} size={80} thickness={5} indeterminate={false} progress={playType === 'exercise' && exercises[index] !== undefined ? time / exercises[index].workoutTime : 0} showsText={true} formatText={renderTimer} />
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
        fontSize: GlobalStyle.SCREEN_WIDTH / 20,
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
        fontSize:  GlobalStyle.SCREEN_WIDTH / 15,
        fontWeight: 600,
    }
});

export default WorkoutScreen;