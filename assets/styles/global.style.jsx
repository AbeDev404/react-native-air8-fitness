import { Dimensions } from 'react-native'
import Colors from './colors'

const {width, height} = Dimensions.get('window');

export default {
    SCREEN_WIDTH: width,
    SCREEN_HEIGHT: height,
    Manjari: {
        fontFamily: 'Manjari',
    },
    ManjariBold: {
        fontFamily: 'ManjariBold'
    },
    BoxShadow: {
        //iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        //Android
        elevation: 24,
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.BGlight
    },
    flex: (direction, xOption, yOption) => {
        if(direction.indexOf('row') >= 0) {
            return {
                flexDirection: 'row',
                justifyContent: xOption,
                alignItems: yOption
            }
        } else if(direction.indexOf('column') >= 0) {
            return {
                flexDirection: 'column',
                justifyContent: yOption,
                alignItems: xOption
            }
        }
    },
    round: {
        borderRadius: 30,
    },
    label: {
        fontSize: 20,
        fontWeight: 700,
    },
}