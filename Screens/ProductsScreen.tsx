import React, { useEffect, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { AlphaSection, AlphabetList, getAlphaIndex, getEmptyAlphaSection } from '../Components/AlphabetList';
import { GetAllProducts, Product } from '../Controller';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import OilBlendProductInfoScreen from './OilBlendProductInfoScreen';


function ProductsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'ProductsScreen'>) {
	const [data, setData] = useState<AlphaSection<Product>>([]);
	const screenWidth = useWindowDimensions().width;
	const [selectedProduct, setSelectedProduct] = useState<Product>();

	/**
	 * Retrieves products from database and groups them alphabetically.
	 */
	async function getData() {
		// Initialize empty sectioned products object
		const sectionedProducts = getEmptyAlphaSection<Product>();

		// Fetch and iterate through products
		(await GetAllProducts()).forEach((product) => {
			// Retrieve corresponding alpha section based on first letter of product code
			const sectionData = sectionedProducts[getAlphaIndex(product.code[0].toUpperCase())].data;


			// Replace &trade; with ™ and &ref; with ®
			product.code = product.code.replace(/&trade;/g, '™').replace(/&reg;/g, '®');

			// Create new product object to add to alpha section, if not already present
			const newProduct = { value: product.code, key: product.code, info: product };
			if (
				!sectionData.some(
					(existingProduct) => existingProduct.value === newProduct.value
				)
			) {
				sectionData.push(newProduct);
			}
		});

		// Update component state with filtered sectioned products that have content
		setData(sectionedProducts.filter((section) => section.data.length > 0));
	}

	// Get the data when the screen renders
	useEffect(() => { getData() }, []);


	return (
		<View style={{	flexDirection: "row"	}}>
			<View style={{ maxWidth: screenWidth > 800 ? 400 : undefined, width: "100%" }}>
				<AlphabetList
					sections={data}
					searchPlaceholder={"Search Products..."}
					onRowPress={(value) => {
						const product = data.find(section => section.title === value[0])?.data.find(oil => oil.value === value)?.info || data[0].data[0].info;
						if (screenWidth > 800) {
							setSelectedProduct(product);
						}
						else {
							navigation.navigate("OilBlendProductInfoScreen", { info: product, type: "oil" })
						}
					}}
				/>
			</View>
			{
				screenWidth > 800 && selectedProduct &&
				<View style={{ flex: 1 }}>
					{/** @ts-ignore */}
					<OilBlendProductInfoScreen navigation={navigation} route={{ params: { info: selectedProduct, type: "product" } }} />
				</View>	
			}
		</View>
	)

}


export default ProductsScreen;




