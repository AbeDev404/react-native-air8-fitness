import Constants from 'expo-constants'

export default {
    firebaseConfig : {
        apiKey: Constants.expoConfig.extra.apiKey,
        authDomain: Constants.expoConfig.extra.authDomain,
        databaseURL: Constants.expoConfig.extra.databaseURL,
        projectId: Constants.expoConfig.extra.projectId,
        storageBucket: Constants.expoConfig.extra.storageBucket,
        messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
        appId: Constants.expoConfig.extra.appId,
        measurementId: Constants.expoConfig.extra.measurementId,
    },
}