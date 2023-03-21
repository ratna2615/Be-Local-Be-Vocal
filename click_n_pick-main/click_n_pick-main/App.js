import React, {useState, useEffect} from 'react';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getUser} from './logistics';
import Home from './screens/Home';
import Splash from './screens/Splash';
import Authentication from './screens/Authentication';
import Profile from './screens/Profile';
import Account from './screens/Account';
import Market from './screens/Market';
import Notifications from './screens/Notifications';
import MarketExpanded from './screens/MarketExpanded';
import Chat from './screens/Chat';
import Chats from './screens/Chats';
import Create from './screens/Create';
import Create_Post from './screens/Create_Post';
import linking from './linking';
import Search from './screens/Search';
import Settings from './screens/Settings';
import PasswordReset from './screens/PasswordReset';
import BottomTab from './component/BottomTab';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs(['Require cycle:']);

const Stack = createNativeStackNavigator(),
  screens = [
    {name: 'Home', component: Home},
    {name: 'Account', component: Account},
    {name: 'Market', component: Market},
    {name: 'Notifications', component: Notifications},
    {name: 'MarketExpanded', component: MarketExpanded},
    {name: 'Chat', component: Chat},
    {name: 'Chats', component: Chats},
    {name: 'Create', component: Create},
    {name: 'Create_Post', component: Create_Post},
    {name: 'Search', component: Search},
    {name: 'Settings', component: Settings},
    {name: 'PasswordReset', component: PasswordReset},
  ],
  navigationRef = React.createRef(),
  navigate = (name, params) => {
    navigationRef.current?.navigate(name, params);
  };

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [processing, setProcessing] = useState(true);
  const [routeName, setRouteName] = useState('');

  const fetchCredentials = async () => {
    await getUser();
    if (global.USER) {
      setAuthenticated(true);
    }
    setProcessing(false);
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  if (processing) return <Splash />;
  else if (authenticated)
    return (
      <NavigationContainer
        linking={linking}
        ref={navigationRef}
        onReady={() => {
          const currentRoute = navigationRef.current.getCurrentRoute();
          setRouteName(currentRoute.name);
        }}
        onStateChange={() => {
          const currentRoute = navigationRef.current.getCurrentRoute();
          setRouteName(currentRoute.name);
        }}>
        <Stack.Navigator>
          {screens.map((screen, key) => (
            <Stack.Screen
              key={key}
              name={screen.name}
              component={screen.component}
              options={{headerShown: false}}
            />
          ))}
          <Stack.Screen
            name={'Profile'}
            component={Profile}
            options={{headerShown: false}}
            initialParams={{setAuthenticated: setAuthenticated}}
          />
        </Stack.Navigator>
        {routeName === 'Chats' ||
        routeName === 'Chat' ||
        routeName === 'Settings' ? null : (
          <BottomTab navigate={navigate} routeName={routeName} />
        )}
      </NavigationContainer>
    );
  else return <Authentication setAuthenticated={setAuthenticated} />;
};

export default App;
