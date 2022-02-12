import "react-native-gesture-handler";
import { createDrawerNavigator } from '@react-navigation/drawer';
import {NavigationContainer} from "@react-navigation/native"
import Distributor from './screens/Distributor';
import ItemScreen from "./screens/Item";
import PersonScreen from "./screens/Person";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Distributor">
        <Drawer.Screen name="Distributor" component={Distributor}/>
        <Drawer.Screen name="Barang" component={ItemScreen}/>
        <Drawer.Screen name="Utang" component={PersonScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}