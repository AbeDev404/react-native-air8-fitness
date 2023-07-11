import {useEffect, useState} from 'react'
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config'

export default useRemoveWorkout = () => {
    const [loading, setLoading] = useState(false);

    const removeWorkout = (workoutName) => {
        if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        setLoading(true)
        FireStore().collection('Workouts').doc('test').get().then(result => {
            let keys = Object.keys(result._data)
            let data = {};
            for(let i = 0 ; i < keys.length ; i++) keys[i] !== workoutName && (data[keys[i]] = result._data[keys[i]])

            if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig);
            FireStore().collection('Workouts').doc('test').set(data).then(res => {
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            })
        }).catch(error => {
            setLoading(false);
        })
    }

    return [loading, removeWorkout]
}