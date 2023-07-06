import {useState} from 'react';
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config'

const useStoreWorkouts = () => {
    const [response, setResponse] = useState(null)
    
    const storeWorkouts = (type, workouts, name) => {
        return new Promise((resolve, reject) => {
            if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig);

            FireStore().collection('Workouts').doc('test').get().then(result => {
                let pos = Object.keys(result._data).indexOf(name);
                if(pos >= 0 && type === 'new.workouts') {
                    resolve('exist')
                } else {
                    let data = result._data;
                    data[name] = workouts;
                    
                    console.log(workouts, data);
                    
                    FireStore().collection('Workouts').doc('test').set(data).then(result => {
                        resolve('success')
                    }).catch(error => {
                        reject('failed')
                    });
                }
            }).catch(error => {
                reject('failed')
            }); 
        })
    }

    return [response, storeWorkouts]
}

export default useStoreWorkouts