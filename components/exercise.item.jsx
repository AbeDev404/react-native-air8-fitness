import { useEffect, useState } from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native'
import LottieView from 'lottie-react-native'

import useVideoThumbnails from '../hooks/useVideoThumbnails';

import GlobalStyle from '../assets/styles/global.style';
import Colors from '../assets/styles/colors';
import Loading from '../assets/drawables/loading.json'

const ExerciseItem = ({data, category, uid, navigation, onAddExercise, removeExercise, radded, addable}) => {
    const [uri, generateThumbnail] = useVideoThumbnails();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setAdded(radded)
    }, [])

    useEffect(() => {
        if(data !== null) {
            // generateThumbnail(data.video_url)
        }
    }, [data])

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

    const onAdd = () => {
        if(!added) onAddExercise && onAddExercise(uid, data);
        else removeExercise && removeExercise(uid, data);
        setAdded(e => !e)
    }

    return (
        <TouchableOpacity onPress={goToDetailExercise} style={[GlobalStyle.flex('row', 'space-around', 'center'), GlobalStyle.round, Styles.exerciseItem, GlobalStyle.BoxShadow]}>
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
                <View style={[GlobalStyle.round, {overflow: 'hidden', backgroundColor: Colors.MainGreen}]}>
                    <Text style={[GlobalStyle.Manjari, Styles.label, Styles.idName]}>{ exerciseID() }</Text>
                </View>
                <View style={[GlobalStyle.flex('row', 'center', 'center')]}>
                    { data.size.map((item, index, array) => <Text key={index} style={[GlobalStyle.Manjari, Styles.label]}>{item} </Text>) }
                </View>
                { addable && (
                    <TouchableOpacity onPress={onAdd} style={[GlobalStyle.round, {overflow: 'hidden'}]}>
                        <Text style={[GlobalStyle.Manjari, Styles.label, Styles.addButton, {backgroundColor: added ? Colors.ButtonBGlight : Colors.MainGreen,}]}>
                            { added ? 'Added' : 'Add' }
                        </Text>
                    </TouchableOpacity>
                ) }
            </View>
        </TouchableOpacity>
    )
}

ExerciseItem.defaultProps = {
    addable: true
}

const Styles = new StyleSheet.create({
    exerciseItem: {
        width: '90%',
        backgroundColor: 'white',
        marginBottom: 20,
        paddingTop: 10,
        paddingBottom: 10,
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
    }
});

export default ExerciseItem