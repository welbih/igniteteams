import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';

import { Groups } from '@screens/Groups';
import { NewGroup } from '@screens/NewGroup';
import { Players } from '@screens/Players';

const  { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen
                    name='groups'
                    component={Groups}
                    />
                
                <Screen
                    name='new'
                    component={NewGroup}
                    />
                
                <Screen
                    name='players'
                    component={Players}
                    />
            </Navigator>
        </NavigationContainer>
    );
}