import React from 'react'
import { WebView } from "react-native-webview";
import AppConfig from '../Constants/AppConfig'

function AboutScreen() {
	var url = AppConfig.apiUrl + 'general/api/info/about.html'
	return (
		<WebView
			style={{ flex: 1 }}
			source={{
				uri: url,
				headers: { 'Authorization': 'Token token="' + AppConfig.token + '"' }
			}}
			decelerationRate={"normal"}
		/>
	)
}

export default AboutScreen