import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Platform, Linking, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AppConfig from '../Constants/AppConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import Purchases, { ErrorInfo, PurchasesStoreProduct } from 'react-native-purchases';


function ShareScreen() {
	const [shareProduct, setShareProduct] = useState<PurchasesStoreProduct>();
	const [shareAccess, setShareAccess] = useState(false);
	const [purchaseLoading, setPurchaseLoading] = useState(false);


	async function havePurchasedSharing() {
		const access = await AsyncStorage.getItem(AppConfig.shareSubscriptionId);
		if (access !== null || true) setShareAccess(access === "true" ? true : false);
	}
	useEffect(() => { havePurchasedSharing() }, []);


	useEffect(() => {
		async function getProducts() {
			const products = await Purchases.getProducts([AppConfig.shareSubscriptionId]) || [];
			if (products.length > 0) {
				let foundSharingProduct = false;
				products.forEach(product => {
					if (product.identifier === AppConfig.shareSubscriptionId || product.identifier === AppConfig.shareSubscriptionId + ":p1y" || product.defaultOption?.productId === AppConfig.shareSubscriptionId) {
						setShareProduct(product);
						foundSharingProduct = true;
					}
				})
				if (foundSharingProduct) return;
				else console.error("Not valid products?", products)
			}
			else {
				console.error("Products returned an empty array :(")
			}


		}
		getProducts();
	}, [])

	async function handlePurchase() {
		setPurchaseLoading(true);

		if (shareProduct) {
			try {
				const result = await Purchases.purchaseStoreProduct(shareProduct);

				if (result.customerInfo.activeSubscriptions.includes(AppConfig.shareSubscriptionId) || result.customerInfo.activeSubscriptions.includes(AppConfig.shareSubscriptionId + ":p1y")) {
					givePurchaseAccess();
					return;
				}
				
			} catch (error) {
				setPurchaseLoading(false);

				//@ts-ignore Don't show errors if the user just cancelled the action.
				if (error.userCancelled) { console.log("User Cancelled"); return; }
				//@ts-ignore Give the user access if the error returned with code 6 (Product is already active for user).
				if (error.code === "6") {
					givePurchaseAccess();
					return;
				}

				console.error(error)
			}
		}

		setPurchaseLoading(false);
		Alert.alert("Purchase Error", "There was an issue with purchasing this subscription. Please try again later.")

	}

	function givePurchaseAccess() {
		setPurchaseLoading(false);
		setShareAccess(true);
		AsyncStorage.setItem(AppConfig.shareSubscriptionId, "true");
	}


	const styles = StyleSheet.create({
		header: { fontSize: 25, fontWeight: "600", textAlign: "center", marginTop: 20 },
		descriptionContainer: { margin: 10 },
		descriptionText: { fontSize: 16, margin: 5 },
		bold: { fontWeight: "700" },
		italic: { fontStyle: "italic" },
		exampleText: { fontSize: 16, margin: 10, marginLeft: 30 },
		purchasedShare: { fontSize: 20, fontWeight: "600", alignSelf: "center", textAlign: "center", color: 'rgb(105, 65, 148)' }
	});

	return (
		<View style={{ flex: 1 }}>
			<ScrollView>
				<Text style={styles.header} maxFontSizeMultiplier={AppConfig.maxFontScale}>
					EoE Books sharing
				</Text>
					<View style={{ marginTop: 20 }}>
						<View style={{ marginHorizontal: 10 }}>
							{ shareAccess 
							  ? <View>
									<Text style={styles.purchasedShare} >You have purchased the Sharing Subscription</Text>
									<Text style={{ alignSelf: "center", fontSize: 16 }} >Manage your subscription in the Settings app.</Text>
								</View>
							  : <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
									<Button onPress={purchaseLoading ? undefined : handlePurchase} title="Purchase Sharing Subscription" />
									{ purchaseLoading && <ActivityIndicator /> }
								</View>
							}
							
						</View>

						<View style={styles.descriptionContainer}>
							<Text style={styles.descriptionText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								<Text style={styles.bold}>About the subscription:</Text>{"\n"}
								The Share feature for EoEbooks app is the ability to share information via email with users who don't have access to the app.
								The term of the Share Feature subscription is 1 year, and the cost is <Text style={styles.bold}>$1.99/year</Text>.  The subscription auto-renews at the end of the 1 year term until the user chooses to cancel it.
							</Text>
							<Text style={styles.descriptionText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								<Text style={styles.bold}>Description:</Text>{"\n"}
								The Share feature on the EoEbooks App allows users to find information that may be helpful to someone else, and email that to a friend or associate.
							</Text>
							<Text style={styles.exampleText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								An example would be, if your friend calls and says their daughter was burned, you could open the App, search burns and share the information quickly with your friend by using this share feature.
							</Text>
							<Text style={styles.descriptionText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								This provides a quick and convenient way to share with others the benefits of essential oils and related products for family members, friends and associates.
							</Text>
							<Text style={styles.descriptionText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								<Text style={styles.bold}>How to use:</Text>{"\n"}
								This Share icon <FontAwesome name="share-square-o" size={15} color="black" /> appears on the Health Concerns, Oils, Blends and Products pages. To
								share any of these pages just tap this icon. A new screen will appear allowing you to enter the
								Recipients name, Recipients email, Your name, Your email plus a personal note to the recipient
								from you. You may then press “Share information” to deliver the email.
							</Text>
							<Text style={styles.descriptionText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								Some email service providers or computer settings may deliver emails to folders other than the Inbox
								we suggest having them check their spam, junk or promotions (gmail) folders for your shared information.
								Also you may have them add essentialoilhelps@eoebooks.com to their contact list to
								avoid this problem in the future.
							</Text>
							<Text style={styles.descriptionText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								<Text style={styles.bold}>FAQ:</Text>{"\n"}
								<Text style={styles.italic}>I notice folks I Share with cannot “reply” directly to my Share email. Why is that? </Text>
							</Text>
							<Text style={styles.exampleText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								Because we send this Share email from another server and with the internet concerns
								about privacy and fraudulent activity we cannot use your email address as the “sender”
								of the information. To send a thankyou response the recipient will have to initiate
								another email directly to you.
							</Text>
							<Text style={styles.descriptionText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								<Text style={styles.italic}>My Share email has not been received by the person I shared with?</Text>
							</Text>
							<Text style={styles.exampleText} maxFontSizeMultiplier={AppConfig.maxFontScale}>
								We have noticed that email providers differ. Some will deliver emails immediately
								without delay, other have delay. We have noticed delays as long as 15-30 minutes on
								occasion.{"\n"}
								{"\n"}
								Sometimes, because of settings on the recipients computer, an email will be delivered
								to the “spam” or “junk” box instead of the “inbox”. If your recipient has not received the
								Share email have them check their spam or junk box or with gmail the "promotions" folder. If it is in any of these have them mark it as
								“not spam” or “not junk”. They can also add the email address essentialoilhelps@eoebooks.com to their list of contacts
								that will assure future emails get to them.
								{"\n"}
							</Text>
						</View>
					</View>
			</ScrollView>
		</View>
	);
};

export default ShareScreen;