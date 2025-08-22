import React, { useEffect } from 'react'
import { Text, ImageBackground, Image, View, TouchableOpacity, StyleSheet } from 'react-native'
import ButtonBox from '../Components/ButtonBox'
import AppConfig from '../Constants/AppConfig'
import { openURL } from "expo-linking";
import { colors } from '../Constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '../Screens/Navigation'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'HomeScreen'>) => {

	const styles = createStyles();

	const openWebSite = () => {
		openURL('http://www.eoebooks.com')
	}

	useEffect(() => navigation.navigate("NotificationModal"), [])

	return (
		<View style={styles.screenContainer}>
			<ImageBackground source={AppConfig.images.backgroundImage} style={styles.backgroundImage}>
				<View style={styles.container}>
					<Image source={AppConfig.images.logo} style={styles.logo} resizeMode='contain' />
					<View style={styles.buttonContainer}>
						<ButtonBox onPress={() => navigation.navigate("OverviewScreen")} image={AppConfig.images.icons.overview} text='Overview' />
						<ButtonBox onPress={() => navigation.navigate("GlossaryScreen")} image={AppConfig.images.icons.glossary} text='Glossary' />
						<ButtonBox onPress={() => navigation.navigate("SafetyConsiderationsScreen")} image={AppConfig.images.icons.safety} text='Safety with oils' />
						<ButtonBox onPress={() => navigation.navigate("UsingOilsScreen")} image={AppConfig.images.icons.apply} text='Applying Oils' />
						<ButtonBox onPress={() => navigation.navigate("AllConcernsScreen")} image={AppConfig.images.icons.health} text='Health Concerns' />
						<ButtonBox onPress={() => navigation.navigate("AboutScreen")} image={AppConfig.images.icons.about} text='About' />
						<ButtonBox onPress={() => navigation.navigate("OilsScreen")} image={AppConfig.images.icons.oils} text='Oils' />
						<ButtonBox onPress={() => navigation.navigate("BlendsScreen")} image={AppConfig.images.icons.blends} text='Blends' />
						<ButtonBox onPress={() => navigation.navigate("ProductsScreen")} image={AppConfig.images.icons.products} text='Products' />
						<ButtonBox onPress={() => navigation.navigate("ShareScreen")} image={AppConfig.images.icons.share} text='Share' />
					</View>
					<TouchableOpacity style={styles.bottomContainer} onPress={openWebSite}>
						<Text style={styles.linkLabel} maxFontSizeMultiplier={AppConfig.maxFontScale}>Shop eoebooks.com here</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</View>
	)
}


function createStyles() {
	const insets = useSafeAreaInsets();

	return StyleSheet.create({
		screenContainer: {
			flex: 1,
			paddingTop: insets.top,
			backgroundColor: "rgb(242, 238, 245)",
		},
		backgroundImage: {
			flex: 1,
			backgroundColor: 'rgba(197, 157, 210, 0.8)',
		},
		container: {
			flex: 1,
			backgroundColor: 'rgba(197, 157, 210, 0.8)'
		},
		logo: {
			width: "100%",
			height: undefined,
			aspectRatio: 2.82685512367,
			opacity: 0.80,
		},
		buttonContainer: {
			flexWrap: "wrap", flexDirection: "row", justifyContent: "center", flex: 1
		},
		bottomContainer: {
			paddingBottom: insets.bottom === 0 ? 10 : insets.bottom - 5,
			padding: 8,
			flexDirection: 'row',
			width: '100%',
			alignItems: 'center',
			backgroundColor: 'rgba(71, 39, 122, 0.50)'
		},
		linkLabel: {
			fontSize: 18,
			width: '100%',
			color: colors.snow,
			textAlign: 'center'
		},
	})
}

export default HomeScreen