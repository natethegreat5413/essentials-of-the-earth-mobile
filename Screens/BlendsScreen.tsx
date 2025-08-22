import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { AlphaSection, AlphabetList, getAlphaIndex, getEmptyAlphaSection } from '../Components/AlphabetList';
import { Blend, GetAllBlends } from '../Controller';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import OilBlendProductInfoScreen from './OilBlendProductInfoScreen';

function BlendsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'BlendsScreen'>) {
	const [data, setData] = useState<AlphaSection<Blend>>([]);
	const screenWidth = useWindowDimensions().width;
	const [selectedBlend, setSelectedBlend] = useState<Blend>();

	/**
	 * Retrieves blends from database and groups them alphabetically.
	 */
	async function getData() {
		// Initialize empty sectioned blends object
		const sectionedBlends = getEmptyAlphaSection<Blend>();
		// Fetch and iterate through blends
		(await GetAllBlends()).forEach((blend) => {
			// Retrieve corresponding alpha section based on first letter of blend code
			const sectionData = sectionedBlends[getAlphaIndex(blend.code[0].toUpperCase())].data;

			// Replace &trade; with ™ and &ref; with ®
			blend.code = blend.code.replace(/&trade;/g, '™').replace(/&reg;/g, '®');

			// Create new blend object to add to alpha section, if not already present
			const newBlend = { value: blend.code, key: blend.code, info: blend };
			if (
				!sectionData.some(
					(existingBlend) => existingBlend.value === newBlend.value
				)
			) {
				sectionData.push(newBlend);
			}
		});

		// Update component state with filtered sectioned blends that have content
		setData(sectionedBlends.filter((section) => section.data.length > 0));
	}

	// Get the data when the screen renders
	useEffect(() => { getData() }, []);

	return (
		<View style={{ flexDirection: "row" }}>
			<View style={{ maxWidth: screenWidth > 800 ? 400 : undefined, width: "100%" }}>
				<AlphabetList
					sections={data}
					searchPlaceholder={"Search Blends..."}
					onRowPress={(value) => {
						const blend = data.find(section => section.title === value[0])?.data.find(blend => blend.value === value)?.info || data[0].data[0].info;
						if (screenWidth > 800) {
							setSelectedBlend(blend);
						}
						else {
							navigation.navigate("OilBlendProductInfoScreen", { info: blend, type: "blend" })
						}
					}}
				/>
			</View>
			{
				screenWidth > 800 && selectedBlend &&
				<View style={{ flex: 1 }}>
					{/** @ts-ignore */}
					<OilBlendProductInfoScreen navigation={navigation} route={{ params: { info: selectedBlend, type: "blend" } }} />
				</View>
			}
		</View>
	);
};

export default BlendsScreen;