import React from 'react'
import { WebView } from "react-native-webview";
import AppConfig from '../Constants/AppConfig'

const OverviewOilsScreen = () => {
	const url = AppConfig.apiUrl + 'general/api/info/overview_of_essential_oils.html';

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

export default OverviewOilsScreen
