import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { postShare } from '../Controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShareScreen from './ShareScreen';
import colors from '../Constants/Colors';
import AppConfig from '../Constants/AppConfig';

function ShareModal({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ShareModal'>) {
    const recipientsEmailRef = useRef<TextInput>() as MutableRefObject<TextInput>;
    const nameRef = useRef<TextInput>() as MutableRefObject<TextInput>;
    const emailRef = useRef<TextInput>() as MutableRefObject<TextInput>;
    const notesRef = useRef<TextInput>() as MutableRefObject<TextInput>;

    const [recNameInput, setRecNameInput] = useState({ text: "", error: "" })
    const [recEmailInput, setRecEmailInput] = useState({ text: "", error: "" })
    const [nameInput, setNameInput] = useState({ text: "", error: "" })
    const [emailInput, setEmailInput] = useState({ text: "", error: "" })
    const [noteInput, setNoteInput] = useState({ text: "", error: "" })

    const [shareAccess, setShareAccess] = useState<boolean>();


    async function getDataFromAsyncStorage() {
        const access = await AsyncStorage.getItem(AppConfig.shareSubscriptionId);
        if (access !== null || true) setShareAccess(access === "true" ? true : false);

        const name = await AsyncStorage.getItem("name");
        if (name) setNameInput({ text: name, error: "" });
        const email = await AsyncStorage.getItem("email");
        if (email) setEmailInput({ text: email, error: "" });
    }
    useEffect(() => { getDataFromAsyncStorage() }, [])


    async function onShare() {
        let error = false;

        //#region CHECK TO MAKE SURE ALL FIELDS ARE FILLED OUT
        if (!recNameInput.text) {
            setRecNameInput({ text: recNameInput.text, error: "This is required."})
            error = true;
        }
        if (!recEmailInput.text) {
            setRecEmailInput({ text: recEmailInput.text, error: "This is required." })
            error = true;
        }
        if (!nameInput.text) {
            setNameInput({ text: nameInput.text, error: "This is required." })
            error = true;
        }
        if (!emailInput.text) {
            setEmailInput({ text: emailInput.text, error: "This is required." })
            error = true;
        }
        //#endregion

        //#region CHECK TO MAKE SURE NAMES ARE LESS THAN 50 CHARACTERS
        if (recNameInput.text && recNameInput.text.length > 50) {
            setRecNameInput({ text: recNameInput.text, error: "Value must less than 50 characters."})
            error = true;
        }
        if (nameInput.text && nameInput.text.length > 50) {
            setNameInput({ text: nameInput.text, error: "Value must be less than 50 characters." })
            error = true;
        }
        //#endregion

        //#region CHECK TO MAKE SURE EMAIL ADDRESS IS VALID
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (recEmailInput.text && !emailRegex.test(recEmailInput.text)) {
            setRecEmailInput({ text: recEmailInput.text, error: "Enter a valid email." });
            error = true;
        }
        if (emailInput.text && !emailRegex.test(emailInput.text)) {
            setEmailInput({ text: emailInput.text, error: "Enter a valid email." });
            error = true;
        }
        //#endregion

        if (error) return;

        AsyncStorage.setItem("name", nameInput.text);
        AsyncStorage.setItem("email", emailInput.text);

        try {
            await postShare({
                concern: route.params.concern ? route.params.concern : false,
                recipient: recNameInput.text,
                recipientEmail: recEmailInput.text,
                sender: nameInput.text,
                senderEmail: emailInput.text,
                note: noteInput.text,
                productCode: route.params.code,
                productId: route.params.id.toString()
            })
        }
        catch {
            console.error("FAILURE");
            return Alert.alert("Error", "Unable to send message at this time. Please try again later.", [{ text: "Okay", onPress: navigation.goBack }]);
        }

        return Alert.alert("Success", ` An email has been sent to ${recNameInput.text} at ${recEmailInput.text} on your behalf. \n\nIMPORTANT: Please alert your recipient to check their spam, junk or promotions (gmail) folders if your Share is not in their InBox.`, [{ text: "Okay", onPress: navigation.goBack }]);
    }
    
    if (shareAccess === undefined) return <></>;
    if (shareAccess === false) return (
        <>
        <ScrollView style={{ width: "100%", paddingTop: 50 }} contentContainerStyle={{ maxWidth: 600, alignItems: "center", paddingBottom: 50, alignSelf: "center" }}>
            <Text style={{ color: colors.error, fontSize: 16, fontWeight: "600", paddingHorizontal: 10, textAlign: 'center', marginBottom: 50 }} >You have not purchased a Share Subscription. In order to use the share feature you must have an active subscription.</Text>
            <ShareScreen />
        </ScrollView>
        </>
    )
    return (
        <KeyboardAwareScrollView extraHeight={125} contentContainerStyle={{ alignItems: 'center'}} >
            <View style={{ maxWidth: 600, width: "100%", }}> 

            <Text style={styles.header} adjustsFontSizeToFit numberOfLines={2} >
                Share info about <Text style={{fontWeight: "600"}}>{route.params.code}</Text>.
            </Text>
            <Text style={styles.textHeading} >To:</Text>
            <View style={styles.textInputContainer} >
                <TextInput 
                    style={[styles.textInput, recNameInput.error ? styles.textInputError : undefined]} 
                    placeholder='Recipients Name'

                    value={recNameInput.text}
                    onChangeText={(text) => setRecNameInput({ text: text, error: ""})}

                    onSubmitEditing={() => recipientsEmailRef.current?.focus()}
                    blurOnSubmit={false}
                />
                {recNameInput.error && <Text style={styles.errorText} >{recNameInput.error}</Text>}
                <View style={{borderWidth: 0.5 }} />
                <TextInput
                    ref={recipientsEmailRef}

                    style={[styles.textInput, recEmailInput.error ? styles.textInputError : undefined]}
                    placeholder='Recipients Email'
                    keyboardType='email-address'

                    value={recEmailInput.text}
                    onChangeText={(text) => setRecEmailInput({ text: text, error: "" })}

                    onSubmitEditing={() => nameRef.current?.focus()}
                    blurOnSubmit={false}
                />
                {recEmailInput.error && <Text style={styles.errorText} >{recEmailInput.error}</Text>}
            </View>
            <Text style={styles.textHeading} >From:</Text>
            <View style={styles.textInputContainer} >
                <TextInput
                    ref={nameRef}

                    style={[styles.textInput, nameInput.error ? styles.textInputError : undefined]}
                    placeholder='Your Name'

                    value={nameInput.text}
                    onChangeText={(text) => setNameInput({ text: text, error: "" })}
                    
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                />
                {nameInput.error && <Text style={styles.errorText} >{nameInput.error}</Text>}
                <View style={{ borderWidth: 0.5 }} />
                <TextInput
                    ref={emailRef}
                    
                    style={[styles.textInput, emailInput.error ? styles.textInputError : undefined]}
                    placeholder='Your Email'
                    keyboardType='email-address'

                    value={emailInput.text}
                    onChangeText={(text) => setEmailInput({ text: text, error: "" })}

                    onSubmitEditing={() => notesRef.current?.focus()}
                    blurOnSubmit={false}
                />
                {emailInput.error && <Text style={styles.errorText} >{emailInput.error}</Text>}
            </View>

            <Text style={styles.textHeading} >Notes: </Text>
            <View style={[styles.textInputContainer, { paddingTop: Platform.OS === "ios" ? 10 : undefined }]} >
                <TextInput
                    ref={notesRef}

                    style={[styles.textInput, noteInput.error ? styles.textInputError : undefined]}
                    placeholder='Type Here...'
                    blurOnSubmit
                    multiline

                    value={noteInput.text}
                    onChangeText={(text) => setNoteInput({ text: text, error: "" })}
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 30}} >
                <Button title="Share" onPress={onShare}/>
                <Button title="Cancel" color="#be0a00" onPress={() => navigation.goBack() }/>
            </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default ShareModal;



const styles = StyleSheet.create({
    header: {
        fontSize: 25, alignSelf: "center", marginTop: 50, marginBottom: 20, textAlign: "center", marginHorizontal: 15 
    },
    container: {
        flexDirection: "row"
    },
    textHeading: {
        fontSize: 18, fontWeight: '500', paddingLeft: 25, paddingTop: 20
    },
    textInput: {
        fontSize: 16, padding: 10 
    },
    textInputContainer: {
        marginHorizontal: 10, borderWidth: 1, borderRadius: 10, padding:Platform.OS === "ios" ? 5 : undefined, 
    },
    textInputError: {
        paddingBottom: 0, color: "#f00"
    },
    errorText: {
        color: "#f00", fontSize: 12, marginLeft: 10, bottom: Platform.OS === "android" ? 5 : undefined
    }
})