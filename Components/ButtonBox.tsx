import React from 'react'
import { TouchableOpacity, Text, Image, StyleSheet, ImageSourcePropType, useWindowDimensions } from 'react-native'
import AppConfig from '../Constants/AppConfig'

const ButtonBox = ({ onPress, image, text }: { onPress: () => void, image: ImageSourcePropType, text: string}) => {
	const styles = createStyles();
	return (
		<TouchableOpacity style={[styles.container]} onPress={onPress}>
			<Image resizeMode='contain' source={image} style={styles.image} />
			<Text style={styles.label} maxFontSizeMultiplier={AppConfig.maxFontScale} >{text}</Text>
		</TouchableOpacity>
	)
}


function createStyles() {
	const screenWidth = useWindowDimensions().width;

	// Calculate the number of columns
	let columns = Math.floor(screenWidth / 160);
	// Don't let it exceed 5
	if (columns > 5) columns = 5;


	return StyleSheet.create({
		container: {
			alignItems: "center", justifyContent: 'center',
			flexBasis: `${100 / columns}%`,
			flexGrow: 1,
			height: `${100 / Math.ceil(10 / columns) }%`,
		},
		label: {
			color: "#fff", 
			fontSize: 18, fontWeight: "600"
		},
		image: {
			width: 60,
			height: 60,
		}
	});
}

export default ButtonBox;