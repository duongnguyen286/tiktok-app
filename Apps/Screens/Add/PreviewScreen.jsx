import { View, Text, Image, TextInput, KeyboardAvoidingView, ScrollView, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';
import { s3bucket } from '../../Utils/S3BucketConfig';
import { supabase } from './../../Utils/SupabaseConfig';
import { useUser } from '@clerk/clerk-expo'

export default function PreviewScreen() {
    const { user } = useUser()

    const params = useRoute().params
    const navigation = useNavigation();
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    useEffect(() => {
        console.log(params)
    }, []);

    const publishHandler = async () => {
        const videoUrl = await UploadFileToAws(params.video, 'video');
        const thumbnailUrl = await UploadFileToAws(params.thumbnail, 'image');
        if (videoUrl && thumbnailUrl) {
            // Thêm thông tin vào cơ sở dữ liệu Supabase
            await addToSupabaseDB(videoUrl, thumbnailUrl, description, user?.primaryEmailAddress?.emailAddress);
        } else {
            console.log("Error uploading video or thumbnail");
        }
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
            const data = await s3bucket.upload(params).promise();
            console.log("File Upload...");
            console.log("RESP", data?.Location);
            if (type == 'video') {
                setVideoUrl(data?.Location); // Cập nhật videoUrl
                return data?.Location;
            } else {
                setThumbnailUrl(data?.Location); // Cập nhật thumbnailUrl
                return data?.Location;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    const addToSupabaseDB = async (videoUrl, thumbnailUrl, description, emailRef) => {
        // Thêm thông tin vào cơ sở dữ liệu của Supabase
        const { data, error } = await supabase.from('PostList').insert([
            { videoUrl: videoUrl, thumbnail: thumbnailUrl, description: description, emailRef: emailRef }
        ]);
        if (error) {
            console.error("Error adding to Supabase:", error);
            throw new Error("Error adding to Supabase");
        } else {
            console.log("Added to Supabase:", data);
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