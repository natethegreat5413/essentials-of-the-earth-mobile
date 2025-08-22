import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { WebView } from 'react-native-webview'

import AppConfig from '../Constants/AppConfig'
import { IconButton } from "../Components/IconButton";
import { RootStackParamList } from './Navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Entypo } from '@expo/vector-icons';
import colors from '../Constants/Colors';

function ConcernInfoScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ConcernInfoScreen'>) {
	const { concern } = route.params;
	const [showNoticeModal, setShowNoticeModal] = useState(false)

	let linkEnd = "concern_info.html";
	if (route.params.startingTab === "Protocols") {
		linkEnd = "protocol_info.html";
	}
	else if (route.params.startingTab === "QAndA") {
		linkEnd = "questions_and_answers.info.html";
	}
	const [url, setUrl] = useState(AppConfig.apiUrl + `general/api/concerns/${concern.id}/${linkEnd}`);

	useEffect(() => {
		setUrl(AppConfig.apiUrl + `general/api/concerns/${concern.id}/${linkEnd}`);
		navigation.setOptions({ headerTitle: concern.code, headerRight: concern.has_related_concerns 
			? () => <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 10, paddingRight: 0 }} onPress={() => navigation.navigate("RelatedConcernsModal", { concern: concern })}>
					<Text style={{ margin: 5 }}>See Also</Text>
					<Entypo name="link" size={24} color="black" />
				</TouchableOpacity>
			: undefined });
	}, [concern])

	function openDescription() {
		setUrl(AppConfig.apiUrl + `general/api/concerns/${concern.id}/concern_info.html`)
	}

	function openProtocols() {
		setUrl(AppConfig.apiUrl + `general/api/concerns/${concern.id}/protocol_info.html`)
	}

	function openQandA() {
		setUrl(AppConfig.apiUrl + `general/api/concerns/${concern.id}/questions_and_answers_info.html`)
	}

	return (
		<View style={{ flex: 1 }}>

			<WebView
				style={{ flex: 1 }}
				source={{
					uri: url,
					headers: { Authorization: 'Token token="' + AppConfig.token + '"' },
				}}
				decelerationRate={"normal"}
			/>

			<View style={{ height: 60, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#999", paddingHorizontal: 10, paddingTop: 5 }}>
				<IconButton name="document" type="Ionicons" size={24} style={{ padding: 5 }} onPress={openDescription} color={url.slice(-17) === "concern_info.html" ? "rgb(79, 49, 122)" : "black"} />
				<IconButton name="eyedropper" type="FontAwesome" size={24} style={{ padding: 5 }} onPress={openProtocols} color={url.slice(-18) === "protocol_info.html" ? "rgb(79, 49, 122)" : "black"} />
				<IconButton name="questioncircle" type="AntDesign" size={24} style={{ padding: 5 }} onPress={openQandA} color={url.slice(-17) === "answers_info.html" ? "rgb(79, 49, 122)" : "black"} />
				<IconButton name="share-square-o" type="FontAwesome" size={24} style={{ padding: 5 }} onPress={() => navigation.navigate("ShareModal", { code: concern.code, id: concern.id, concern: true })} />
			</View>
		</View>
	)
}

export default ConcernInfoScreen;