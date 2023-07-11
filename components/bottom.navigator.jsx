import { View, StyleSheet, TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import GlobalStyle from '../assets/styles/global.style'
import Colors from '../assets/styles/colors'

const BottomNavigator = ({route, navigation}) => {
    
    const GoWorkouts = () => {
        if(route.name !== 'Workouts') navigation.push('Workouts', { type: 'my.workouts' })
    }

    const GoHome = () => {
        if(route.name !== 'Home') navigation.replace('Home')
    }

    return (
        <View style={[GlobalStyle.round, GlobalStyle.BoxShadow, GlobalStyle.flex('row', 'space-around', 'center'), Styles.container]}>
            <TouchableOpacity onPress={GoHome}>
                <AntDesign name="home" size={30} color={route.name === 'Home' ? Colors.MainGreen : Colors.SecondaryText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={GoWorkouts}>
                <MaterialIcons name="fitness-center" size={30} color={route.name === 'Workouts' || route.name === 'Workout' ? Colors.MainGreen : Colors.SecondaryText} />
            </TouchableOpacity>
            <TouchableOpacity>
                <AntDesign name="hearto" size={30} color={Colors.SecondaryText} />
            </TouchableOpacity>
            <TouchableOpacity>
                <AntDesign name="user" size={30} color={Colors.SecondaryText} />
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons name="grid-view" size={30} color={Colors.SecondaryText} />
            </TouchableOpacity>
        </View>
    )
}

const Styles = new StyleSheet.create({
    container: {
        width: '90%',
        padding: 10,
        height: 50,
        backgroundColor: 'white',
        marginLeft: '5%',
        position: 'absolute',
        bottom: 30,
    }
});

export default BottomNavigator;