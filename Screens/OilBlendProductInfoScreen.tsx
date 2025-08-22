import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { WebView } from "react-native-webview";
import AppConfig from '../Constants/AppConfig'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import { Text, View } from 'react-native';
import { AlphabetList, HEAD_HEIGHT } from '../Components/AlphabetList';
import { GetOilRelatedConcerns, Recommend, RelatedConcern } from '../Controller';
import { IconButton } from '../Components/IconButton';

type ISections = {
	title: Recommend;
	data: { value: string, key: string, info: RelatedConcern }[]
}[]

const Recommends: Recommend[] = ["Preferred", "Suggested", "Consider"];
function createBlankSections(): ISections {
	return Recommends.map(recommend => ({
		title: recommend,
		data: []
	}))
}
const javascript = `window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight.toString());`;



function OilBlendProductInfoScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'OilBlendProductInfoScreen'>) {
	const { info, type } = route.params;
	const url = AppConfig.apiUrl + `general/api/oils/${info.id}/oil_info.html`;

	const [data, setData] = useState<ISections>([]);
	const [height, setHeight] = useState<number>();

	const webViewRef = useRef<WebView>() as MutableRefObject<WebView>;

	async function getData() {
		const rltConcernSections: ISections = createBlankSections();
		(await GetOilRelatedConcerns(info.id)).forEach(rltConcern => {
			rltConcernSections.find(s => s.title === rltConcern.recommend)?.data.push({ value: rltConcern.code, key: rltConcern.code, info: rltConcern });
		});
		setData(rltConcernSections.filter((section) => section.data.length > 0));
	}

	useEffect(() => {
		getData();
		setHeight(0);
		navigation.setOptions({
			headerTitle: info.code, headerRight: () => <IconButton name="share-square-o" type="FontAwesome" size={24} style={{ padding: 5 }} onPress={() => navigation.navigate("ShareModal", { code: info.code, id: info.id })} />
		});
	}, [info])

	const concernInfoText = `Below are links to specific Health Concern pages where this ${type} is referenced.`;
	
	return (
		<View style={{flex: 1, opacity: height ? 1 : 0}}>
			{/*  */}
			<AlphabetList 
				sections={data}
				onRowPress={(value) => navigation.navigate("ConcernInfoScreen", { concern: { id: getConcernFromRelatedConcerns(value, data), code: value } as any, startingTab: "Protocols" })}
			
				// @ts-ignore
				renderSectionHeader={({ section: { title } }: { section: { title: string } }) => {
					let color = "#000";
					if (title === 'Preferred') {
						color = '#36A311'
					} 
					else if (title === 'Suggested') {
						color = '#C4950A'
					} 
					else if (title === 'Consider') {
						color = '#B01481'
					}
					return <View style={{ justifyContent: "center", flex: 1, backgroundColor: "#ddd", height: HEAD_HEIGHT, opacity: title ? 1 : 0 }}>
						<Text style={{ fontSize: 18, color: color, fontWeight: "700", paddingHorizontal: 5, }}>{title}</Text>
					</View>
				}}

				ListHeaderComponent={<View style={{backgroundColor: "#fff"}}>
					<WebView
						ref={webViewRef}
						style={{ height: height }}
						injectedJavaScript={javascript}
						onMessage={(event) => {
							setHeight(parseInt(event.nativeEvent.data));
						}}
						source={{
							uri: url,
							headers: { 'Authorization': 'Token token="' + AppConfig.token + '"' }
						}}
					/>
					<Text style={{fontSize: 14, paddingHorizontal: 15, marginVertical: 5, fontWeight: "700" }}>Health Concerns</Text>
					<Text style={{fontSize: 14, paddingHorizontal: 15, marginVertical: 10 }}>{concernInfoText}</Text>
				</View>}

				hideAlphaLetters
				maxToRenderPerBatch={undefined} 
				windowSize={undefined} 
				initialNumToRender={30} 
				updateCellsBatchingPeriod={undefined}
				getItemLayout={undefined}
			/>
		</View>
	)
}

export default OilBlendProductInfoScreen;



function getConcernFromRelatedConcerns(value: string, data: ISections) {
	let id = data[0].data[0].info.id;
	data.forEach(section => {
		section.data.forEach(concern => {
			if (concern.value === value) {
				id = concern.info.id;
			}
		})
	});
	return id;
}