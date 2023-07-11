import { useState } from 'react'
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config'

const useWorkouts = () => {
    const [workouts, setWorkouts] = useState([])
    const [workoutNames, setWorkoutNames] = useState([])
    const [loading, setLoading] = useState(false);

    const getWorkouts = () => {
        if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig);

        setLoading(true);
        FireStore().collection('Workouts').doc('test').get().then(result => {
            const keys = Object.keys(result._data);
            setWorkoutNames(keys)
            for(let i = 0 ; i < keys.length ; i++) {
                setWorkouts(data => [
                    ...data,
                    result._data[keys[i]]
                ])
            }
            setLoading(false);
        }).catch(error => {
        })
    }

    return [workouts, workoutNames, loading, getWorkouts]
}

export default useWorkouts;