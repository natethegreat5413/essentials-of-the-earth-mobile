import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AboutScreen from './AboutScreen';
import BlendsScreen from './BlendsScreen';
import ConcernsScreen from './ConcernsScreen';
import GlossaryScreen from './GlossaryScreen';
import HomeScreen from './HomeScreen';
import OilsScreen from './OilsScreen';
import OverviewOilsScreen from './OverviewOilsScreen';
import ProductsScreen from './ProductsScreen';
import SafetyConsiderationsScreen from './SafetyConsiderationsScreen';
import UsingOilsScreen from './UsingOilsScreen';
import ConcernInfoScreen from './ConcernInfoScreen';
import { Blend, Concern, Oil, Product } from '../Controller';
import ShareScreen from './ShareScreen';
import OilBlendProductInfoScreen from './OilBlendProductInfoScreen';
import ShareModal from './ShareModal';
import RelatedConcerns from './RelatedConcernsModal';
import { Button, Platform } from 'react-native';
import NotificationModal from './NotificationModal';

export type RootStackParamList = {
	HomeScreen: undefined,
	OverviewScreen: undefined,
	GlossaryScreen: undefined,
	SafetyConsiderationsScreen: undefined,
	UsingOilsScreen: undefined,
	AllConcernsScreen: undefined,
	ConcernInfoScreen: { concern: Concern, startingTab?: "Description" | "Protocols" | "QAndA" },
	AboutScreen: undefined,
	OilsScreen: undefined,
	OilBlendProductInfoScreen: { info: Oil | Blend | Product, type: "oil" | "blend" | "product" },
	BlendsScreen: undefined,
	ProductsScreen: undefined,
	ShareScreen: undefined,

	ShareModal: { id: number, code: string, concern?: boolean },
	RelatedConcernsModal: { concern: Concern },
	NotificationModal: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();


function Navigation() {
	const navigation = useNavigation();

	return (
		<Stack.Navigator>
			<Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerTitle: "Home", headerTransparent: true, headerTitleStyle: { fontSize: 0 }, headerShown: Platform.OS !== "android" }} />
			<Stack.Screen name="OverviewScreen" component={OverviewOilsScreen} options={{ headerTitle: "Overview of Oils"}} />
			<Stack.Screen name="GlossaryScreen" component={GlossaryScreen} options={{ headerTitle: "Glossary" }}/>
			<Stack.Screen name="SafetyConsiderationsScreen" component={SafetyConsiderationsScreen} options={{ headerTitle: "Safety" }} />
			<Stack.Screen name="UsingOilsScreen" component={UsingOilsScreen} options={{ headerTitle: "Applying Oils" }} />
			<Stack.Screen name="AllConcernsScreen" component={ConcernsScreen} options={{ headerTitle: "All Concerns" }} />
			<Stack.Screen name="ConcernInfoScreen" component={ConcernInfoScreen} options={{ headerTitle: "Concern" }} />
			<Stack.Screen name="AboutScreen" component={AboutScreen} options={{ headerTitle: "About" }} />
			<Stack.Screen name="OilsScreen" component={OilsScreen} options={{ headerTitle: "All Oils" }} />
			<Stack.Screen name="OilBlendProductInfoScreen" component={OilBlendProductInfoScreen} options={{ headerTitle: "" }} />
			<Stack.Screen name="BlendsScreen" component={BlendsScreen} options={{ headerTitle: "Blends" }} />
			<Stack.Screen name="ProductsScreen" component={ProductsScreen} options={{ headerTitle: "Products" }} />
			<Stack.Screen name="ShareScreen" component={ShareScreen} options={{ headerTitle: "Share" }} />

			<Stack.Screen name="ShareModal" component={ShareModal} options={{ headerTitle: "", presentation: "modal", headerLeft: Platform.OS === "ios" ? () => <Button title="Cancel" onPress={navigation.goBack} /> : undefined, }} />
			<Stack.Screen name="NotificationModal" component={NotificationModal} options={{ headerShown: false, presentation: "modal" }} />
			<Stack.Screen name="RelatedConcernsModal" component={RelatedConcerns} 
						options={{ headerTitle: "Related Concerns", presentation: "modal", 
								headerLeft: Platform.OS === "ios" ? () => <Button title="Cancel" onPress={navigation.goBack} /> : undefined,
						}}
			 />
		</Stack.Navigator>
	);
}

export default Navigation;