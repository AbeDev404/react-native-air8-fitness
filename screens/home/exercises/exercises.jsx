import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl} from 'react-native'
import { useEffect, useRef, useState } from 'react';
import * as Animatable from 'react-native-animatable'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import useFitnessCategory from '../../../hooks/useFitnessCategory';
import useExercises from '../../../hooks/useExercises';

import Loading from '../../../components/loading';
import ExerciseItem from '../../../components/exercise.item'
import Colors from '../../../assets/styles/colors';
import GlobalStyle from '../../../assets/styles/global.style'
import BottomNavigator from '../../../components/bottom.navigator'

const HomeScreen = ({route, navigation}) => {
    const toRight = { from: { left: '0%' }, to: { left: '50%' } }
    const toLeft = { from: { left: '50%' }, to: { left: '0%' } }
    const _selecter = useRef()
    const [type, setType] = useState(true)
    const [allActive, setAllActive] = useState(true);
    const [activeCategory, pushActiveCategory] = useState([])
    const [category, fetchFitnessCategoryData] = useFitnessCategory()
    const [exercises, loading, fetchExercises] = useExercises();
    const [lastDocument, setLastDocument] = useState(null);
    const [method, setMethod] = useState('browse')
    const [tempData, setTempData] = useState([])

    useEffect(() => {
        route.params.type === 'office' && onToggleTab();
        fetchFitnessCategoryData();
    }, [])

    useEffect(() => {
        if(route.params.method !== undefined) setMethod(route.params.method)
        if(route.params.method === 'get') {
            route.params.selectedData !== undefined && setTempData(route.params.selectedData);
        }
    }, [route.params])

    useEffect(() => {
        if(activeCategory.length === 0) setAllActive(true);
        fetchExercises(activeCategory, type, null)
    }, [type, activeCategory])

    useEffect(() => {
        if(exercises !== null && exercises.length) setLastDocument(exercises[exercises.length - 1]);
        if(exercises === null || !exercises.length) setLastDocument(null);
    }, [exercises]);

    const onActiveCategory = (e) => {
        if(e === 'all') {
            setAllActive(true);
            pushActiveCategory([])
        } else {
            setAllActive(false);
            if(activeCategory.indexOf(e) >= 0) {
                let temp = activeCategory.filter((item, index, array) => item !== e);
                pushActiveCategory(temp)
            } else {
                pushActiveCategory(categories => [...categories, e])
            }        
        }
    }

    const onToggleTab = () => {
        if(type) _selecter.current.animate(toRight)
        else _selecter.current.animate(toLeft)
        setLastDocument(null);
        setType(type => !type)
    }

    const onAddExercise = (uid, data) => {
        if(method !== 'get') setMethod('push')
        setTempData(array => [
            ...array,
            { uid: uid, data: data, category: category, workoutTime: 30, breakTime: 10 }
        ])
    }
    const removeExercise = (uid, data) => {
        tempData.length === 1 && method !== 'get' && setMethod('browse')
        setTempData(data => data.filter((item, index, array) => item.uid !== uid))
    }
    const exportExercises = () => {
        if(method === 'get') {
            route.params.callback(tempData);
            navigation.pop();
        } else if(method === 'push') {
            navigation.push('Workouts', {
                type: 'new.workouts',
                data: tempData
            })
        }
    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
    };

    const loadMore = () => {
        fetchExercises(activeCategory, type, lastDocument)
    }

    return (
        <View style={[GlobalStyle.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
            <View style={[GlobalStyle.flex('row', 'center', 'center'), Styles.menu, GlobalStyle.round, GlobalStyle.BoxShadow]}>
                <TouchableOpacity style={{position: 'absolute', left: -20}} onPress={() => navigation.pop()}>
                    <MaterialIcons name="arrow-back-ios" size={20} color={Colors.DarkGreen} />
                </TouchableOpacity>
                <Animatable.View ref={_selecter} style={[Styles.selector]}></Animatable.View>
                <TouchableOpacity onPress={() => onToggleTab()} style={[Styles.menuItem, GlobalStyle.flex('row', 'center', 'center')]}>
                    <Text style={[GlobalStyle.ManjariBold, Styles.label]}>Fitness</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onToggleTab()} style={[Styles.menuItem, GlobalStyle.flex('row', 'center', 'center')]}>
                    <Text style={[GlobalStyle.ManjariBold, Styles.label]}>Office</Text>
                </TouchableOpacity>
            </View>

            <View style={[Styles.categoryList]}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                    <TouchableOpacity onPress={() => onActiveCategory('all')} style={[allActive ? Styles.activeCategory : Styles.normalCategory, Styles.categoryItem, GlobalStyle.round, GlobalStyle.flex('row', 'center', 'center')]}>
                        <Text style={[GlobalStyle.Manjari, Styles.categoryLabel]}>All</Text>
                    </TouchableOpacity>
                    {
                        Object.keys(category).map((item, index, array) => {
                            let active = activeCategory.indexOf(item) >= 0 ? true: false;
                            return (
                                <TouchableOpacity onPress={() => onActiveCategory(item)} style={[active ? Styles.activeCategory : Styles.normalCategory, Styles.categoryItem, GlobalStyle.round, GlobalStyle.flex('row', 'center', 'center')]} key={index}>
                                    <Text style={[GlobalStyle.Manjari, Styles.categoryLabel]}>{category[item]}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>

            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMore}/> } scrollEventThrottle={400} contentContainerStyle={[GlobalStyle.flex('column', 'center', 'flex-start'), Styles.exerciseContainer]} style={{ width: '100%' }}>
                {exercises !== null && exercises.map((item, index, array) => {
                    let _radded = tempData.filter((a, b, c) => a.uid === item._ref._documentPath._parts[1]);
                    return (
                        <ExerciseItem radded={_radded.length > 0 ? true : false} onAddExercise={onAddExercise} removeExercise={removeExercise} key={index} data={item._data} category={category} uid={item._ref._documentPath._parts[1]} navigation={navigation} />
                )})}
            </ScrollView>
            
            <Loading loading={loading} />
            { (method === 'get' || method === 'push') && (
                <TouchableOpacity onPress={exportExercises} style={[Styles.addButton, GlobalStyle.round, GlobalStyle.BoxShadow]}>
                    <Text style={[GlobalStyle.Manjari, Styles.buttonLabel]}>Add Exercises</Text>
                </TouchableOpacity>
            ) }
            { method === 'browse' && (
                <BottomNavigator route={route} navigation={navigation} />
            )}
        </View>
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
        color: Colors.DarkGreen,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 20,
        fontWeight: 600
    },
    menu: {
        backgroundColor: 'white',
        marginTop: GlobalStyle.SCREEN_HEIGHT / 30,
        width: GlobalStyle.SCREEN_WIDTH * 0.8,
        position: 'relative'
    },
    menuItem: {
        flexGrow: 0.5,
        paddingTop: 5,
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
        paddingHorizontal: 15,
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
    },
    exerciseContainer: {
        paddingTop: 20,
        paddingBottom: 80,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
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
});

export default HomeScreen;