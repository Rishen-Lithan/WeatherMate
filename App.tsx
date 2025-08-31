import WelcomeScreen from "./src/screens/WelcomeScreen";
import StartingScreen from "./src/screens/StartingScreen";
import PredictitonScreen from "./src/screens/PredictitonScreen";
import ActivityScreen from "./src/screens/ActivityScreen";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} />
        <Stack.Screen name='StartingScreen' component={StartingScreen} />
        <Stack.Screen name='PredictitonScreen' component={PredictitonScreen} />
        <Stack.Screen name='ActivityScreen' component={ActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
