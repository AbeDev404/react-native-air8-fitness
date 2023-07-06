import {useState} from 'react'
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config'

export default useExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchExercises = (category, type, lastDocument) => {
        if(FirebaseApp.apps.length === 0) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        setLoading(true);
        if(lastDocument === null) setExercises(null);
        let query = FireStore().collection('Exercises');
        query = query.where('type', '==', type ? 'fitness' : 'office')
        if(category.length !== 0) query = query.where('category', 'array-contains-any', category);
        if (lastDocument !== undefined && lastDocument !== null) query = query.startAfter(lastDocument);
        query.limit(10).get().then(querySnapshot => {
            if(querySnapshot._docs.length == 0) { 
                if(lastDocument === undefined || lastDocument === null) setExercises([])
                else setExercises(e => e.concat([]))
            }
            else if (lastDocument !== undefined && lastDocument !== null) setExercises(e => e.concat(querySnapshot._docs))
            else setExercises(querySnapshot._docs)
            setLoading(false);
        });
    }

    return [exercises, loading, fetchExercises]
}