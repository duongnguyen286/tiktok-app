import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../Utils/Colors'
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useNavigation } from '@react-navigation/native';
export { useNavigation } from '@react-navigation/native'

export default function AddScreen() {

    const navigation = useNavigation()
    /**
     * Chọn video từ điện thoại để tải lên
     */
    const SelectVideoFile = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);

        if (!result.canceled) {
            console.log(result.assets[0].uri)
            GenerateVideoThumbnail(result.assets[0].uri)
        }
    };

    // Sử dụng để tạo ra hình thu nhỏ (thumbnail)
    const GenerateVideoThumbnail = async (videoUri) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                videoUri,
                {
                    time: 10000,
                }
            );
            // console.log("Thumbnail", uri);
            navigation.navigate('preview-screen', {
                video: videoUri,
                thumbnail: uri
            })
        } catch (e) {
            console.warn(e);
        }
    };

    return (
        <View style={{
            padding: 20,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: 1
        }}>
            <Image source={require('./../../../assets/images/folder.png')}
                style={{
                    width: 140,
                    height: 140
                }}
            />
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 20,
                marginTop: 20
            }}>Start Uploading Short Video</Text>

            <TouchableOpacity
                onPress={SelectVideoFile}
                style={{
                    backgroundColor: Colors.BLACK,
                    padding: 10,
                    paddingHorizontal: 25,
                    borderRadius: 99,
                    marginTop: 50
                }}
            >
                <Text style={{ color: Colors.WHILE, fontFamily: 'outfit' }}>Selcet Video File</Text>
            </TouchableOpacity>
        </View>
    )
}