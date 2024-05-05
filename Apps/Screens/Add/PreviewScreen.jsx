import { View, Text, Image, TextInput, KeyboardAvoidingView, ScrollView, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import Colors from '../../Utils/Colors';

export default function PreviewScreen() {

    const params = useRoute().params

    useEffect(() => {
        console.log(params)
    }, []);
    return (
        <KeyboardAvoidingView style={{ backgroundColor: Colors.WHILE, flex: 1 }}>
            <ScrollView style={{ padding: 20 }}>
                <View style={{
                    alignItems: 'center',
                    marginTop: 100
                }}>
                    <Text style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 20
                    }}>Add Details</Text>
                    <Image source={{ uri: params?.thumbnail }}
                        style={{
                            width: 200,
                            height: 300,
                            borderRadius: 15,
                            marginTop: 15
                        }}
                    />
                    <TextInput
                        numberOfLines={3}
                        placeholder='Description'
                        style={{
                            borderWidth: 1,
                            width: '100%',
                            borderRadius: 10,
                            marginTop: 25,
                            borderColor: Colors.BACKGROUND_TRANSNP,
                            paddingHorizontal: 20
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.BLACK,
                            padding: 10,
                            paddingHorizontal: 25,
                            borderRadius: 99,
                            marginTop: 50
                        }}
                    >
                        <Text style={{ color: Colors.WHILE, fontFamily: 'outfit' }}>Publish</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}