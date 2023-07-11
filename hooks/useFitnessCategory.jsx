import {useState} from 'react';
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config'

export default useFitnessCategory = () => {
    const [category, setCategory] = useState([]);

    const fetchFitnessCategoryData = () => {
        if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        FireStore().collection('Constants').doc('Categories').get().then(result => {
            setCategory(result._data)
        }).catch(error => {
            // console.log(error);
        });
    }

    return [category, fetchFitnessCategoryData]
}