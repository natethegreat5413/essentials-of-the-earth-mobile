




import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import { Concern, GetRelatedConcerns } from '../Controller';


function RelatedConcernsModal({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'RelatedConcernsModal'>) {

    const [data, setData] = useState<Concern[]>([])

    async function getData() {
        setData(await GetRelatedConcerns(route.params.concern.id));
    }

    useEffect(() => { getData() }, [])

    function navigateTo(concern: Concern) {
        navigation.goBack();
        setTimeout(() => {
            navigation.push("ConcernInfoScreen", { concern: concern } );
        }, 500);
    }

    return (
        <View>
            <FlatList
                data={data}
                style={{paddingVertical: 30}}
                contentContainerStyle={{ paddingBottom: 50 }}
                initialNumToRender={20}
                renderItem={({ item }) => <TouchableOpacity style={styles.buttonContainer} onPress={() => navigateTo(item)}>
                                            <Text style={styles.buttonTitle}>{item.code}</Text>
                                          </TouchableOpacity>}
            />
        </View>
    );
};

export default RelatedConcernsModal;



const styles = StyleSheet.create({
    buttonContainer: {
        padding: 15, alignSelf: "center"
    },
    buttonTitle: {
        fontSize: 18, fontWeight: "500"
    }
})
