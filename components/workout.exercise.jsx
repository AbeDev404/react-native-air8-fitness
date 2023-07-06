import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image, Pressable} from 'react-native'
import LottieView from 'lottie-react-native'

import useVideoThumbnails from '../hooks/useVideoThumbnails';

import GlobalStyle from '../assets/styles/global.style';
import Colors from '../assets/styles/colors';
import Loading from '../assets/drawables/loading.json'
import Trash from '../assets/drawables/trash.json'

const WorkoutExerciseItem = ({time1, time2, time3, data, category, uid, navigation, timerType, onChangeTimer, onRemoveExercise}) => {
    const [uri, generateThumbnail] = useVideoThumbnails();
    const [type, setType] = React.useState(1)

    React.useEffect(() => {
        if(data !== null) {
            // generateThumbnail(data.video_url)
        }
    }, [data])

    React.useEffect(() => {
        setType(timerType)
    }, [timerType])

    React.useEffect(() => {
        let timer = 0;
        if(type === 1) timer = time1;
        if(type === 2) timer = time2;
        if(type === 3) timer = time3;
        onChangeTimer(uid, timer)
    }, [type])

    const exerciseID = () => {
        let index = data.ID.indexOf('_');
        let str = index >= 0 ? data.ID.substr(0, index) : data.ID;
        return (
            <Text style={[GlobalStyle.round, GlobalStyle.Manjari, Styles.label, Styles.idName]}>{str}</Text>
        )
    }

    const goToDetailExercise = () => {
        navigation.push('Exercise', {
            uid: uid,
            data: data,
            category
        })
    }

    return (
        <View onPress={goToDetailExercise} style={[GlobalStyle.flex('column', 'center', 'flex-start'), GlobalStyle.round, Styles.exerciseItem, GlobalStyle.BoxShadow]}>
            <View style={[GlobalStyle.flex('row', 'space-around', 'center'), {width: '100%'}]}>
                <View style={{width: '20%'}}>
                    {
                        <Image style={{width: '100%', height: 80, borderRadius: 20}} source={require('../assets/drawables/template.png')} />
                        // uri ? (<Image style={{width: 80, height: 80}} source={{uri: uri}} />) 
                        // : (<LottieView source={Loading} autoPlay loop style={{width: 80}} />)
                    }
                </View>
                <View style={[GlobalStyle.flex('column', 'flex-start', 'space-around'), {width: '50%'}]}>
                    <Text style={[GlobalStyle.Manjari, Styles.label, Styles.bold]}>{data.en_name}</Text>
                    <Text style={[GlobalStyle.Manjari, Styles.label1]}>
                        {
                            data.category.map((item, index, array) => {
                                let str =  category[item];
                                if(index !== data.category.length - 1) str += ', '
                                return str
                            })
                        }
                    </Text>
                </View>
                <View style={[GlobalStyle.flex('column', 'center', 'space-around'), {width: '20%'}]}>
                    <Text style={[GlobalStyle.round, GlobalStyle.Manjari, Styles.label, Styles.idName]}>
                        { exerciseID() }
                    </Text>
                    <View style={[GlobalStyle.flex('row', 'center', 'center')]}>
                        { data.size.map((item, index, array) => <Text key={index} style={[GlobalStyle.Manjari, Styles.label]}>{item} </Text>) }
                    </View>
                </View>
            </View>
            <View style={[GlobalStyle.flex('row', 'center', 'center')]}>
                <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => onRemoveExercise(uid)}>
                    <LottieView source={Trash} autoPlay={false} style={{width: 50}} progress={0} />
                </TouchableOpacity>
                <View style={[GlobalStyle.flex('row', 'center', 'center'), Styles.menu, GlobalStyle.round, GlobalStyle.BoxShadow]}>
                    <Pressable onPress={() => setType(1)} style={[GlobalStyle.round, Styles.menuItem1, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 1 && Styles.activeMenuItem]}>
                        <Text style={[GlobalStyle.ManjariBold, Styles.menulabel, type === 1 && Styles.activeLabel]}>{`${time1} s`}</Text>
                    </Pressable>
                    <Pressable onPress={() => setType(2)} style={[GlobalStyle.round, Styles.menuItem2, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 2 && Styles.activeMenuItem, ]}>
                        <Text style={[GlobalStyle.ManjariBold, Styles.menulabel, type === 2 && Styles.activeLabel]}>{`${time2} s`}</Text>
                    </Pressable>
                    <Pressable onPress={() => setType(3)} style={[GlobalStyle.round, Styles.menuItem3, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 3 && Styles.activeMenuItem, ]}>
                        <Text style={[GlobalStyle.ManjariBold, Styles.menulabel, type === 3 && Styles.activeLabel]}>{`${time3} s`}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const Styles = new StyleSheet.create({
    exerciseItem: {
        width: '90%',
        backgroundColor: 'white',
        marginBottom: 10,
    },
    label: {
        fontSize: 14
    },
    bold: {
        fontWeight: 'bold'
    },
    label1: {
        fontSize: 12
    },
    addButton: {
        color: Colors.DarkGreen,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        textAlign: 'center'
    },
    idName: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.MainGreen,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        textAlign: 'center'
    },

    menulabel: {
        color: Colors.DarkGreen,
        paddingHorizontal: 20,
        fontSize: 15,
        fontWeight: 600,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    menu: {
        width: '80%',
        height: 50
    },
    activeMenuItem: {
        backgroundColor: Colors.MainGreen
    },
    activeLabel: {
        color: 'white'
    },
    menuItem: {
        flexGrow: 0.5,
        paddingTop: 5,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: Colors.MainGreen,
        backgroundColor: 'white',
    },
    menuItem1: {
        position: 'absolute',
        left: 0,
        zIndex: 0,
        width: '40%',
    },
    menuItem2: {
        position: 'absolute',
        left: '30%',
        zIndex: 2,
        width: '45%'
    },
    menuItem3: {
        position: 'absolute',
        right: 0,
        zIndex: 1,
        width: '35%',
    },
});

export default WorkoutExerciseItem