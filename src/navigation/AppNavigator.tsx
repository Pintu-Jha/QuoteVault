import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { SplashScreen } from '../screens/auth/SplashScreen';

import { CategoryBrowseScreen } from '../screens/main/CategoryBrowseScreen';
import { CategoryQuotesScreen } from '../screens/main/CategoryQuotesScreen';
import { CollectionDetailScreen } from '../screens/main/CollectionDetailScreen';
import { CollectionsScreen } from '../screens/main/CollectionsScreen';
import { FavoritesScreen } from '../screens/main/FavoritesScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SearchScreen } from '../screens/main/SearchScreen';
import { ShareQuoteScreen } from '../screens/main/ShareQuoteScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

import { AuthStackParamList, ExploreStackParamList, RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const ExploreStackNavigator = createStackNavigator<ExploreStackParamList>();
const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

const ExploreStack = () => {
    return (
        <ExploreStackNavigator.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', }}>
            <ExploreStackNavigator.Screen name="CategoryBrowse" component={CategoryBrowseScreen} />
            <ExploreStackNavigator.Screen name="CategoryQuotes" component={CategoryQuotesScreen} />
        </ExploreStackNavigator.Navigator>
    );
};

const MainTabs = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#000000',
                    borderTopColor: '#1A1A1A',
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: '#666666',
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreStack}
                options={{
                    tabBarLabel: 'Explore',
                    tabBarIcon: ({ color, size }) => <Icon name="compass" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Saved"
                component={FavoritesScreen}
                options={{
                    tabBarLabel: 'Saved',
                    tabBarIcon: ({ color, size }) => <Icon name="bookmark" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => <Icon name="person" size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};

const AuthStack = () => {
    const { colors } = useTheme();

    return (
        <AuthStackNavigator.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}>
            <AuthStackNavigator.Screen name="Login">
                {({ navigation }) => (
                    <LoginScreen
                        onNavigateToSignUp={() => navigation.navigate('SignUp')}
                        onNavigateToResetPassword={() => navigation.navigate('ResetPassword')}
                    />
                )}
            </AuthStackNavigator.Screen>
            <AuthStackNavigator.Screen name="SignUp">
                {({ navigation }) => (
                    <SignUpScreen onNavigateToLogin={() => navigation.navigate('Login')} />
                )}
            </AuthStackNavigator.Screen>
            <AuthStackNavigator.Screen name="ResetPassword">
                {({ navigation }) => (
                    <ResetPasswordScreen onNavigateBack={() => navigation.navigate('Login')} />
                )}
            </AuthStackNavigator.Screen>
        </AuthStackNavigator.Navigator>
    );
};

export const AppNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { colors } = useTheme();
    const [showSplash, setShowSplash] = React.useState(true);

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <NavigationContainer
            theme={{
                dark: false,
                colors: {
                    primary: colors.primary,
                    background: colors.background,
                    card: colors.surface,
                    text: colors.textPrimary,
                    border: colors.border,
                    notification: colors.primary,
                },
                fonts: {
                    regular: {
                        fontFamily: 'System',
                        fontWeight: '400',
                    },
                    medium: {
                        fontFamily: 'System',
                        fontWeight: '500',
                    },
                    bold: {
                        fontFamily: 'System',
                        fontWeight: '700',
                    },
                    heavy: {
                        fontFamily: 'System',
                        fontWeight: '900',
                    },
                },
            }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: colors.background },
                    animation: 'slide_from_right',
                }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="Search" component={SearchScreen} />
                        <Stack.Screen name="Collections" component={CollectionsScreen} />
                        <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
                        <Stack.Screen
                            name="ShareQuote"
                            component={ShareQuoteScreen}
                            options={{
                                presentation: 'modal',
                                cardStyle: { backgroundColor: 'transparent' }
                            }}
                        />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
