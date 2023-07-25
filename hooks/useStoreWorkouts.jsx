import {useState} from 'react';
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config'
import DeviceInfo from 'react-native-device-info';

const useStoreWorkouts = () => {
    const [response, setResponse] = useState(null)
    
    const storeWorkouts = (type, workouts, name) => {
        if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig)
        return new Promise((resolve, reject) => {
            DeviceInfo.getUniqueId().then((uniqueId) => {
                FireStore().collection('Workouts').doc(`${uniqueId}`).get().then(result => {
                    console.log(result)
                    let pos;
                    if(result._data === undefined) pos = -1;
                    else pos = Object.keys(result._data).indexOf(name);

                    if(pos >= 0 && type === 'new.workouts') {
                        resolve('exist')
                    } else {
                        let data = result._data === undefined ? {} : result._data;
                        data[name] = workouts;
                        console.log(data)
                        
                        if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig)
                        FireStore().collection('Workouts').doc(`${uniqueId}`).set(data).then(result => {
                            resolve('success')
                        }).catch(error => {
                            console.log(error);
                            reject('failed')
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    reject('failed')
                }); 
            })
        })
    }

    return [response, storeWorkouts]
}

export default useStoreWorkouts