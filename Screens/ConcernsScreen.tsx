import React, { useEffect, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { AlphaSection, AlphabetList, getAlphaIndex, getEmptyAlphaSection } from '../Components/AlphabetList';
import { Concern, GetRootConcerns } from '../Controller';
import ConcernInfoScreen from './ConcernInfoScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';


function ConcernsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AllConcernsScreen'>) {
	const [data, setData] = useState<AlphaSection<Concern>>([]);
	const screenWidth = useWindowDimensions().width;
	const [selectedConcern, setSelectedConcern] = useState<Concern>();

	/**
	 * Retrieves root concerns from database and groups them alphabetically.
	 */
	async function getData() {
		// Initialize empty sectioned concerns object
		const sectionedConcerns = getEmptyAlphaSection<Concern>();

		// Fetch and iterate through root concerns
		(await GetRootConcerns()).forEach((concern) => {
			// Retrieve corresponding alpha section based on first letter of concern code
			const sectionData = sectionedConcerns[getAlphaIndex(concern.code[0].toUpperCase())].data;

			// Create new concern object to add to alpha section, if not already present
			const newConcern = { value: concern.code, key: concern.code, info: concern };
			if (
				!sectionData.some(
					(existingConcern) => existingConcern.value === newConcern.value
				)
			) {
				sectionData.push(newConcern);
			}
		});

		// Update component state with filtered sectioned concerns that have content
		setData(sectionedConcerns.filter((section) => section.data.length > 0));
	}

	// Get the data when the screen renders
	useEffect(() => { getData() }, []);

	return (
		<View style={{ flexDirection: "row"}}>
			<View style={{ maxWidth: screenWidth > 800 ? 400 : undefined, width: "100%" }}>
				<AlphabetList
					sections={data}
					searchPlaceholder={"Search Concerns..."}
					onRowPress={(value) => {
						const concern = data.find(section => section.title === value[0])?.data.find(concern => concern.value === value)?.info || data[0].data[0].info;
						if (screenWidth > 800) {
							setSelectedConcern(concern);
						}
						else {
							navigation.navigate("ConcernInfoScreen", { concern: concern})
						}
					}}
				/>
			</View>
			{
				screenWidth > 800 && selectedConcern &&
				<View style={{ flex: 1 }}>
					{/** @ts-ignore */}
					<ConcernInfoScreen navigation={navigation} route={{ params: { concern: selectedConcern }}} />
				</View>
			}
		</View>
	)

}


export default ConcernsScreen;




