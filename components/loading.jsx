import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import LoadingGif from '../assets/drawables/loading.json'
import GlobalStyle from '../assets/styles/global.style';

const Loading = (props) => {
    return (
        <View style={[Styles.container, { position: props.loading ? 'absolute': 'relative', display: props.loading ? 'flex': 'none' }]}>
            <View style={[Styles.loading]}>
                <LottieView
                    autoPlay
                    style={{width: 100, height: 100 }}
                    source={LoadingGif}
                />
            </View>
        </View>
    )
}

const Styles = new StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: GlobalStyle.SCREEN_WIDTH, 
        height: GlobalStyle.SCREEN_HEIGHT, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: GlobalStyle.SCREEN_WIDTH, 
        height: GlobalStyle.SCREEN_HEIGHT, 
    }
})

export default Loading;