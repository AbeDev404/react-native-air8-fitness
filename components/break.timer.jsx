import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native'

import GlobalStyle from '../assets/styles/global.style';
import Colors from '../assets/styles/colors';

const BreakTimer = ({uid, title, containerStyle, time1, time2, time3, timerType, onChangeTimer}) => {
    const [type, setType] = React.useState(1);
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

    return (
        <View style={[GlobalStyle.flex('row', 'space-around', 'center'), containerStyle, Styles.container]}>
            <Text style={[GlobalStyle.ManjariBold, Styles.title]}>{title}</Text>
            <View style={[GlobalStyle.flex('row', 'center', 'center'), Styles.menu, GlobalStyle.round, GlobalStyle.BoxShadow]}>
                <Pressable onPress={() => setType(1)} style={[GlobalStyle.round, Styles.menuItem1, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 1 && Styles.activeMenuItem]}>
                    <Text style={[GlobalStyle.ManjariBold, Styles.label, type === 1 && Styles.activeLabel]}>{`${time1} s`}</Text>
                </Pressable>
                <Pressable onPress={() => setType(2)} style={[GlobalStyle.round, Styles.menuItem2, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 2 && Styles.activeMenuItem, ]}>
                    <Text style={[GlobalStyle.ManjariBold, Styles.label, type === 2 && Styles.activeLabel]}>{`${time2} s`}</Text>
                </Pressable>
                <Pressable onPress={() => setType(3)} style={[GlobalStyle.round, Styles.menuItem3, Styles.menuItem, GlobalStyle.flex('row', 'center', 'center'), type === 3 && Styles.activeMenuItem, ]}>
                    <Text style={[GlobalStyle.ManjariBold, Styles.label, type === 3 && Styles.activeLabel]}>{`${time3} s`}</Text>
                </Pressable>
            </View>
        </View>
    )
}

const Styles = new StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
    },
    title: {
        color: Colors.DarkGreen,
        paddingRight: 20,
        fontSize: GlobalStyle.SCREEN_WIDTH / 30,
        fontWeight: 600,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    label: {
        color: Colors.DarkGreen,
        paddingHorizontal: 20,
        fontSize: GlobalStyle.SCREEN_WIDTH / 30,
        fontWeight: 600,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    menu: {
        width: '70%',
        height: '100%'
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
})

export default BreakTimer