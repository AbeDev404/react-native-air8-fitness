import {useState, useEffect, useRef} from 'react'
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native'
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import BottomNavigator from '../../../components/bottom.navigator';
import Loading from '../../../components/loading';

import GlobalStyle from '../../../assets/styles/global.style'
import Colors from '../../../assets/styles/colors'
import Workouts from '../../../assets/drawables/dumbbell.json'
import Favorite from '../../../assets/drawables/favorite.json'

const ExerciseDetailScreen = ({route, navigation}) => {
  const setupVideo = useRef(null), mainVideo = useRef(null);
  const [status, setStatus] = useState({});
  const [videoType, setVideoType] = useState('setup')
  const [loading, setLoading] = useState(false);

  const exerciseID = () => {
    let index = route.params.data.ID.indexOf('_');
    let str = index >= 0 ? route.params.data.ID.substr(0, index) : route.params.data.ID;

    return str
  }

  const renderCushion = () => {
    let value = [];
    for(let i = 0 ; i < route.params.data.cushion_amount ; i++) value.push(i + 1)
    return value;
  }

  return (
    <View style={[GlobalStyle.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
      <View style={[Styles.toolbar, Styles.maxWidth, GlobalStyle.flex('row', 'space-between', 'center')]}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <MaterialIcons name="arrow-back-ios" size={30} color={Colors.DarkGreen} />
        </TouchableOpacity>
        <Text style={[GlobalStyle.ManjariBold, Styles.label]}>{route.params.data.en_name}</Text>
        <Text style={[GlobalStyle.Manjari, Styles.label, Styles.idName, GlobalStyle.round]}>{exerciseID()}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={[{width: '100%', marginBottom: 50}]} contentContainerStyle={[GlobalStyle.flex('column', 'center', 'flex-start'), {paddingBottom: 50}]}>
        <View style={[Styles.videoContainer, GlobalStyle.BoxShadow, GlobalStyle.round]}>
          <Video
            ref={setupVideo}
            style={Styles.video}
            source={{
              uri: videoType === 'setup' ? route.params.data.setup_video_url : route.params.data.video_url,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onLoadStart={() => setLoading(true)}
            onLoad={() => setLoading(false)}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />
        </View>
        <View style={[Styles.maxWidth, Styles.toolbar, GlobalStyle.flex('row', 'space-between', 'center')]}>
          <TouchableOpacity onPress={() => setVideoType('setup')} style={[Styles.button, GlobalStyle.round, GlobalStyle.BoxShadow, videoType === 'setup' && Styles.activeButton]}>
            <Text style={[Styles.label]}>Get Ready For The Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVideoType('exercise')} style={[Styles.button, GlobalStyle.round, GlobalStyle.BoxShadow, videoType === 'exercise' && Styles.activeButton]}>
            <Text style={[Styles.label]}>Show Me The Exercise</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[Styles.maxWidth, Styles.border, GlobalStyle.BoxShadow, GlobalStyle.round]}>
          <View style={[GlobalStyle.flex('row', 'flex-start', 'center'), Styles.description_line]}>
            <Text style={[GlobalStyle.ManjariBold, Styles.label, Styles.headerTitle]}>Good for :</Text>
            <Text style={[GlobalStyle.Manjari, Styles.text]}>
              {
                  route.params.data.category.map((item, index, array) => {
                      let str = route.params.category[item];
                      if(index !== route.params.data.category.length - 1) str += ', '
                      return str
                  })
              }
            </Text>
          </View>

          <View style={[GlobalStyle.flex('row', 'flex-start', 'center'), Styles.description_line]}>
            <Text style={[GlobalStyle.ManjariBold, Styles.label, Styles.headerTitle]}>Use with :</Text>
            {
              renderCushion().map((item, index, array) => 
                <MaterialIcons key={index} style={{marginRight: 10}} name="fitness-center" size={25} color={Colors.SecondaryText} />
              )
            }
          </View>

          <View style={[GlobalStyle.flex('row', 'flex-start', 'center'), Styles.description_line]}>
            <Text style={[GlobalStyle.ManjariBold, Styles.label, Styles.headerTitle]}>Size :</Text>
            <Text style={[GlobalStyle.Manjari, Styles.text]}>
              { route.params.data.size.map((item, index, array) => { return (index !== 0 ? 'or ' : ' ') + item + ' '}) }
            </Text>
          </View>

          <View style={[GlobalStyle.flex('row', 'flex-start', 'center'), Styles.description_line]}>
            <Text style={[GlobalStyle.ManjariBold, Styles.label, Styles.headerTitle]}>Air filling :</Text>
            <View style={[GlobalStyle.flex('row', 'flex-start', 'center')]}>
              {
                ['L', 'M', 'H'].map((item, index, array) => {
                  let value;
                  if(index === 0) value = (<View key={index} style={[Styles.circle, route.params.data.air_content.filter((a, b, c) => a === item).length > 0 && Styles.circleYellow]}></View>)
                  if(index === 1) value = (<View key={index} style={[Styles.circle, route.params.data.air_content.filter((a, b, c) => a === item).length > 0 && Styles.circleGreen]}></View>)
                  if(index === 2) value = (<View key={index} style={[Styles.circle, route.params.data.air_content.filter((a, b, c) => a === item).length > 0 && Styles.circleRed]}></View>)

                  return value
                })
              }
            </View>
          </View>
        </View>

        <View style={[Styles.maxWidth, GlobalStyle.flex('row', 'space-around', 'center'), Styles.addToolbar]}>
          <TouchableOpacity style={[GlobalStyle.flex('column', 'center', 'center')]}>
            <LottieView source={Workouts} style={{width: 80}} loop autoPlay />
            <Text style={[GlobalStyle.ManjariBold, Styles.label]}>My Workouts</Text>
          </TouchableOpacity>
          <Text style={[GlobalStyle.ManjariBold, Styles.label]}>Add to</Text>
          <TouchableOpacity style={[GlobalStyle.flex('column', 'center', 'center')]}>
            <LottieView source={Favorite} style={{width: 80}} loop autoPlay />
            <Text style={[GlobalStyle.ManjariBold, Styles.label]}>My Favourites</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[GlobalStyle.ManjariBold, Styles.label, Styles.maxWidth, {textAlign: 'left', fontSize: 20, marginTop: 20}]}>Description</Text>
        <Text style={[Styles.maxWidth, GlobalStyle.Manjari, Styles.label, {textAlign: 'left', fontSize: 18}]}>{route.params.data.description}</Text>
      </ScrollView>

      <Loading loading={loading} />
      <BottomNavigator route={route} navigation={navigation} />
    </View>
  )
}

const Styles = new StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.DarkGreen,
  },
  idName: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.MainGreen,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    textAlign: 'center'
  },
  toolbar: {
    marginTop: 20,
    paddingBottom: 20,
  },  
  videoContainer: {
    width: GlobalStyle.SCREEN_WIDTH * 0.9,
    height: GlobalStyle.SCREEN_WIDTH * 0.75,
    backgroundColor: 'white',
    marginTop: 20,
  },
  button: {
    width: GlobalStyle.SCREEN_WIDTH * 0.42,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.MainGreen,
    justifyContent:'center',
    alignItems: 'center'
  },
  maxWidth: {
    width: GlobalStyle.SCREEN_WIDTH * 0.9
  },
  activeButton: {
    backgroundColor: Colors.MainGreen
  },
  video: {
    width: '100%',
    height: '100%'
  },
  border: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 13,
    width: '70%'
  },
  headerTitle: {
    marginRight: 10,
  },
  description_line: {
    marginBottom: 5,
    marginLeft: 15,
    width: '100%'
  },
  addToolbar: {
    marginTop: 15,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: Colors.ButtonBGlight,
    marginRight: 8,

    //iOS
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.29,
    shadowRadius: 8.00,

    //Android
    elevation: 12,
  },
  circleYellow: {
    backgroundColor: 'yellow'
  },
  circleGreen: {
    backgroundColor: Colors.MainGreen
  },
  circleRed: {
    backgroundColor: 'red'
  },
});

export default ExerciseDetailScreen