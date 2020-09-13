import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAY4FiU4-Pp8NWbqM-aQZkcV3fm8yM12fw',
  authDomain: 'comsats-cr.firebaseapp.com',
  databaseURL: 'https://comsats-cr.firebaseio.com',
  projectId: 'comsats-cr',
  storageBucket: 'comsats-cr.appspot.com',
  messagingSenderId: '233194843749',
  appId: '1:233194843749:web:6ba01cca30302d2f',
  measurementId: 'G-B1G2TE6QMS',
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
db.enablePersistence({ synchronizeTabs: true });

export const classesCollection = db.collection('classes');
