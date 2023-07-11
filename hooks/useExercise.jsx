import { useState } from 'react'
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config'

const useExercise = () => {
    const [exercise, setExercise] = useState([])

    const getExercise = async (uid) => {
        if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig);

        const data = await FireStore().collection('Exercises').doc(uid).get()
        setExercise(data)
        return data._data;
    }

    return [exercise, getExercise]
}

export default useExercise;