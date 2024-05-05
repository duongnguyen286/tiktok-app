import { View, Text, Image, TextInput, KeyboardAvoidingView, ScrollView, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';
import { s3bucket } from '../../Utils/S3BucketConfig';

export default function PreviewScreen() {

    const params = useRoute().params
    const navigation = useNavigation();
    const [description, setDescription] = useState();
    const [videoUrl, setVideoUrl] = useState();

    useEffect(() => {
        console.log(params)
    }, []);

    const publishHandler = async () => {
        await UploadFileToAws(params.video, 'video');
        await UploadFileToAws(params.thumbnail, 'image');
    }

    const UploadFileToAws = async (file, type) => {
        const fileType = file.split('.').pop(); // Ví dụ: .mp4, .png, .jpg
        const params = {
            Bucket: 'tiktok-app',
            Key: `duongnguyen286-${Date.now()}.${fileType}`, // ex:duongnguyen286-1714921588254.mp4
            Body: await fetch(file).then(resp => resp.blob()),
            ACL: 'public-read',
            ContentType: type == 'video' ? `video/${fileType}` : 'image/${fileType}'
        }
        try {
            const data = await s3bucket.upload(params)
                .promise().then(resp => {
                    console.log("File Upload...");
                    console.log("RESP", resp?.Location);
                    if (type == 'video') {
                        setVideoUrl(resp?.Location)
                    } else {
                        console.log(resp.Location, videoUrl)
                    }
                })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <KeyboardAvoidingView style={{ backgroundColor: Colors.WHILE, flex: 1 }}>
            <ScrollView style={{ padding: 20 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 20 }}>
                    <Ionicons name="arrow-back-circle" size={44} color="black" />
                    <Text style={{ fontFamily: 'outfit', fontSize: 20 }}>Back</Text>
                </TouchableOpacity>
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
                        onChangeText={(value) => setDescription(value)}
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
                        onPress={publishHandler}
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