import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Replace this with your own config details
var config = {
  apiKey: "AIzaSyC2S8SAbIYgLegKxj70loTdRrx0NEg0Af8",
  authDomain: "cloud-computing-255905.firebaseapp.com",
  databaseURL: "https://cloud-computing-255905.firebaseio.com",
  projectId: "cloud-computing-255905",
  storageBucket: "cloud-computing-255905.appspot.com",
  messagingSenderId: "30769414150",
  appId: "1:30769414150:web:3103f8c261e34cefcf4387",
  measurementId: "G-S42LQPB1WT"
};
firebase.initializeApp(config);
// firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase 