import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Navigation from './Screens/Navigation'
import * as NavigationBar from "expo-navigation-bar"
import { EmitterSubscription, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Purchases, { PurchasesOffering } from "react-native-purchases";
import AppConfig from './Constants/AppConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'


const App = () => {



	async function checkShareSubscriptionStatus() {
		const customerInfo = await Purchases.getCustomerInfo();
		if (customerInfo.activeSubscriptions.includes(AppConfig.shareSubscriptionId) || customerInfo.activeSubscriptions.includes(AppConfig.shareSubscriptionId + ":p1y")) {
			if (await AsyncStorage.getItem(AppConfig.shareSubscriptionId) !== "true") {
				AsyncStorage.setItem(AppConfig.shareSubscriptionId, "true");
			}
			console.log("The User has bought the share subscription");
		}
		else {
			console.log("User has NOT bought the share subscription");
			if (await AsyncStorage.getItem(AppConfig.shareSubscriptionId) === "true") {
				AsyncStorage.setItem(AppConfig.shareSubscriptionId, "false");
			}
		}
	}

	useEffect(() => {

		if (Platform.OS == "android") {
			Purchases.configure({ apiKey: "goog_uMaUmXAXvEbdmlrjinmgWaAgWSo" });
		} 
		else {
			Purchases.configure({ apiKey: "appl_PBxXQcQoqmqnzRauBiiSvTXBLOi" });
		}
		
		checkShareSubscriptionStatus();

	}, []);


	if (Platform.OS === "android") {
		useEffect(() => { NavigationBar.setVisibilityAsync("hidden"); NavigationBar.setBehaviorAsync("inset-swipe"); }, [])
	}

	

	return <SafeAreaProvider>
		<StatusBar />
		<NavigationContainer>
			<Navigation />
		</NavigationContainer>
	</SafeAreaProvider>
}

export default App