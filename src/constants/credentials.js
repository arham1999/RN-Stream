import { NODE_ENV } from '../../env.json';

export const firebaseCredentials = NODE_ENV === "development" ? {
  apiKey: "AIzaSyBDQSegEijUV31n10WDZb9HlPcw-d4fs90",
  authDomain: "stove-dev.firebaseapp.com",
  databaseURL: "https://stove-dev.firebaseio.com",
  projectId: "stove-dev",
  storageBucket: "stove-dev.appspot.com",
  messagingSenderId: "936694143166",
  appId: "1:936694143166:web:3cd2b386aea55e527ea6ef"
} : NODE_ENV === "production" ? {
  apiKey: "AIzaSyDmKF5P-3ML-OoLuk3GWyuq3yK2K4vSlms",
  authDomain: "stove-e851c.firebaseapp.com",
  databaseURL: "https://stove-e851c.firebaseio.com",
  projectId: "stove-e851c",
  storageBucket: "stove-e851c.appspot.com",
  messagingSenderId: "924025028242",
  appId: "1:924025028242:web:e366658e4a687d3421704b",
  measurementId: "G-2MJLHRF421"
} : {};