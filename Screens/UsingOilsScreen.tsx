import React from 'react';
import { WebView } from "react-native-webview";
import AppConfig from '../Constants/AppConfig';

const UsingOilsScreen = () => {
	var url = AppConfig.apiUrl + 'general/api/info/how_to_use_essential_oils.html'
	return (
		<WebView
			style={{ flex: 1 }}
			source={{
				uri: url,
				headers: { 'Authorization': 'Token token="' + AppConfig.token + '"' }
			}}
			decelerationRate={"normal"}
		/>
	);
}

export default UsingOilsScreen;