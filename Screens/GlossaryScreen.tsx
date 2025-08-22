import React from 'react';
import { WebView } from "react-native-webview";
import AppConfig from '../Constants/AppConfig';

const GlossaryScreen = () => {
	const url = AppConfig.apiUrl + 'general/api/v2/info/glossary.html';
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
};

export default GlossaryScreen;