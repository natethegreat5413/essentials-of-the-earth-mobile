import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AppConfig from '../Constants/AppConfig';
import WebView from "react-native-webview";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import { openURL } from "expo-linking";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function NotificationModal({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'NotificationModal'>) {
	const url = AppConfig.apiUrl + 'general/api/app_message/body.html';
	const styles = createStyles();

	return (
		<View style={[styles.container, Platform.OS === "android" && { paddingTop: useSafeAreaInsets().top }]}>
			<View style={{ padding: 10 }}>
				<Image source={AppConfig.images.logo} style={styles.logo} resizeMode='contain' />
			</View>
			<WebView
				style={styles.message}
				source={{
					uri: url,
					headers: { 'Authorization': 'Token token="' + AppConfig.token + '"' }
				}}
				decelerationRate={"normal"}
			/>
			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={navigation.goBack}>
					<Text maxFontSizeMultiplier={AppConfig.maxFontScale} style={styles.button}>Main Menu</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {
					openURL("mailto:essentialoilhelps@eoebooks.com?subject=Feedback");
					navigation.goBack();
				}}>
					<Text maxFontSizeMultiplier={AppConfig.maxFontScale} style={styles.button}>Send Feedback</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

function createStyles() {

	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: "#fff",
		},
		buttonContainer: {
			flex: 0.075,
			flexDirection: 'row',
			justifyContent: 'space-around',
			marginTop: 20,
			marginBottom: 50
		},
		message: {
			height: 800,
			padding: 20,
			margin: 20
		},
		imageContainer: {
			alignItems: 'center'
		},
		button: {
			color: '#147efb',
			fontSize: 20
		},
		logo: {
			width: "100%",
			height: undefined,
			aspectRatio: 2.82685512367,
			opacity: 0.80,
			marginBottom: 10,
		},
	})
}


export default NotificationModal;


