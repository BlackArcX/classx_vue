import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD9ZtT2ATfDPvrIzGf2B6-q81m3u9DXl2c',
  authDomain: 'comsats-class-resource.firebaseapp.com',
  databaseURL: 'https://comsats-class-resource.firebaseio.com',
  projectId: 'comsats-class-resource',
  storageBucket: 'comsats-class-resource.appspot.com',
  messagingSenderId: '991585805800',
  appId: '1:991585805800:web:b1fd985529e5f5a779305d',
  measurementId: 'G-SR7MYWQEY5',
};
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const classesCollection = db.collection('classes');
