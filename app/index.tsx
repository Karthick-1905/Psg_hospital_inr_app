import '../styles/global.css'
import {Redirect} from 'expo-router'

export default function Index() {
  return (
    <Redirect href={'/doctor'}/>
  );
}
