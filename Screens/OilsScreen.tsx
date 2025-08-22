import React, { useEffect, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { AlphaSection, AlphabetList, getAlphaIndex, getEmptyAlphaSection } from '../Components/AlphabetList';
import { GetAllOils, Oil } from '../Controller';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import OilBlendProductInfoScreen from './OilBlendProductInfoScreen';


function OilsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'OilsScreen'>) {
	const [data, setData] = useState<AlphaSection<Oil>>([]);
	const screenWidth = useWindowDimensions().width;
	const [selectedOil, setSelectedOil] = useState<Oil>();

	/**
	 * Retrieves oils from database and groups them alphabetically.
	 */
	async function getData() {
		// Initialize empty sectioned oils object
		const sectionedOils = getEmptyAlphaSection<Oil>();

		// Fetch and iterate through oils
		(await GetAllOils()).forEach((oil) => {
			// Retrieve corresponding alpha section based on first letter of oil code
			const sectionData = sectionedOils[getAlphaIndex(oil.code[0].toUpperCase())].data;

			// Replace &trade; with ™ and &ref; with ®
			oil.code = oil.code.replace(/&trade;/g, '™').replace(/&reg;/g, '®');
			
			// Create new oil object to add to alpha section, if not already present
			const newOil = { value: oil.code, key: oil.code, info: oil };
			if (
				!sectionData.some(
					(existingOil) => existingOil.value === newOil.value
				)
			) {
				sectionData.push(newOil);
			}
		});

		// Update component state with filtered sectioned oils that have content
		setData(sectionedOils.filter((section) => section.data.length > 0));
	}

	// Get the data when the screen renders
	useEffect(() => { getData() }, []);


	return (
		<View style={{ flexDirection: "row"}}>
			<View style={{ maxWidth: screenWidth > 800 ? 400 : undefined, width: "100%" }}>
				<AlphabetList
					sections={data}
					searchPlaceholder={"Search Oils..."}
					onRowPress={(value) => {
						const oil = data.find(section => section.title === value[0])?.data.find(oil => oil.value === value)?.info || data[0].data[0].info;
						if (screenWidth > 800) {
							setSelectedOil(oil);
						}
						else {
							navigation.navigate("OilBlendProductInfoScreen", { info: oil, type: "oil" })
						}
					}}
				/>
			</View>
			{
				screenWidth > 800 && selectedOil &&
				<View style={{ flex: 1 }}>
					{/** @ts-ignore */}
					<OilBlendProductInfoScreen navigation={navigation} route={{ params: { info: selectedOil, type: "oil" }}} />
				</View>
			}
		</View>
	)

}


export default OilsScreen;




