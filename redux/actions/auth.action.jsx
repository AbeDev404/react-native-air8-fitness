import KEYS from '../keys';
import Config from '../config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Auth from '@react-native-firebase/auth';
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import * as Facebook from 'expo-facebook';

export const DoFirebaseSignIn = (email, pwd) => dispatch => {
    dispatch({type: KEYS.SIGN_IN_REQUEST})
    if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);

    Auth().signInWithEmailAndPassword(email, pwd).then(result => {
        FireStore().collection('Users').doc(result.user.uid).get().then(doc => {
            dispatch({
                type: KEYS.SIGN_IN_SUCCESS,
                payload: {
                    uid: user.uid,
                    email: result.user.email,
                    emailVerifed: result.user.emailVerified,
                    username: doc._data.username,
                    phone: doc._data.phone,
                    photo: result.user.photoURL
                },
                service: 'firebase'
            })
        });
    }).catch(error => {
        dispatch({
            type: KEYS.SIGN_IN_FAILURE,
            payload: {
                error: error.code,
                error_description: error.message 
            }
        })
    });
}

export const DoFirebaseSignUp = (email, username, phone, password) => dispatch => {
    dispatch({type: KEYS.SIGN_UP_REQUEST})
    if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);

    Auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        
        FireStore().collection('Users').doc(user.uid).set({
            phone: phone,
            username: username,
            favourites: [],
        }).then(() => {
            user.sendEmailVerification().then(result => {
                dispatch({
                    type: KEYS.SIGN_UP_SUCCESS,
                    payload: {},
                })
            }).catch(error => {
                dispatch({
                    type: KEYS.SIGN_UP_FAILURE,
                    payload: error
                })
            })
        });
    })
    .catch((error) => {
        dispatch({
            type: KEYS.SIGN_UP_FAILURE,
            payload: error
        })
    });
}
export const DoFirebaseSignOut = () => dispatch => {
    Auth()
    .signOut()
    .then(() => console.log('User signed out!'));
}
export const DoGoogleSignIn = () => dispatch => {
    return new Promise(async (resolve, reject) => {
        dispatch({ type: KEYS.SIGN_IN_REQUEST })
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);

        GoogleSignin.configure({
            scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: Config.webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true,
        });

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const googleCredential = Auth.GoogleAuthProvider.credential(userInfo.idToken);
            Auth().signInWithCredential(googleCredential).then(userCredential => {
                const user = userCredential.user;
                
                FireStore().collection('Users').doc(user.uid).set({
                    phone: user.phoneNumber,
                    username: user.displayName,
                    favourites: [],
                }).then(() => {
                    dispatch({
                        type: KEYS.SIGN_IN_SUCCESS,
                        payload: {
                            uid: user.uid,
                            email: user.email,
                            emailVerifed: user.emailVerified,
                            username: user.displayName,
                            phone: user.phoneNumber,
                            photo: user.photoURL
                        },
                        service: 'google'
                    })
                }).catch(error => {
                    dispatch({
                        type: KEYS.SIGN_IN_FAILURE,
                        payload: error
                    })
                });
            });
        } catch (error) {
            dispatch({
                type: KEYS.SIGN_IN_FAILURE,
                payload: {
                    error: 'NETWORK_ERROR',
                    error_description: 'Check your network connection'
                }
            })
        }
    });
}
export const DoFaceBookSignIn = () => dispatch => {
    return new Promise(async (resolve, reject) => {
        dispatch({ type: KEYS.SIGN_IN_REQUEST })

        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        try {
            await Facebook.initializeAsync({appId: Config.FB_APP_ID,});
            const { type, token } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile', 'email'] })

            switch (type) {
                case 'success': {
                    const credential = Auth.FacebookAuthProvider.credential(token);
                    Auth.signInAndRetrieveDataWithCredential(credential).then(userCredential => {
                        const user = userCredential.user;
                        
                        FireStore().collection('Users').doc(user.uid).set({
                            phone: user.phoneNumber,
                            username: user.displayName,
                            favourites: [],
                        }).then(() => {
                            dispatch({
                                type: KEYS.SIGN_IN_SUCCESS,
                                payload: {
                                    uid: user.uid,
                                    email: user.email,
                                    emailVerifed: user.emailVerified,
                                    username: user.displayName,
                                    phone: user.phoneNumber,
                                    photo: user.photoURL
                                },
                                service: 'facebook'
                            })
                        }).catch(error => {
                            dispatch({
                                type: KEYS.SIGN_IN_FAILURE,
                                payload: error
                            })
                        });
                    });
                }
                case 'cancel': {
                    dispatch({
                        type: KEYS.SIGN_IN_FAILURE,
                        payload: error
                    })
                }
            }
        } catch(error) {
            dispatch({
                type: KEYS.SIGN_IN_FAILURE,
                payload: error
            })
        }
    });    
}