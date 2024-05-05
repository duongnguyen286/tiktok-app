import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import Colors from '../../Utils/Colors';


export default function LoginScreen() {
    return (
        <View style={{ flex: 1 }}>
            {/* <Video
                style={styles.video}
                source={{
                    uri: 'https://cdn.pixabay.com/video/2022/06/19/120883-724673735_large.mp4',
                }}
                shouldPlay
                resizeMode='cover'
                isLooping={true}
            /> */}
            <View style={{
                display: 'flex',
                alignItems: 'center',
                paddingTop: 100,
                flex: 1,
                paddingHorizontal: 15,
                backgroundColor: Colors.BACKGROUND_TRANSNP
            }}>
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        // color: Colors.WHILE
                        fontSize: 35
                    }}
                >Duong Nguyen</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 17,
                    textAlign: 'center',
                    marginTop: 15

                }}>Ứng dụng video ngắn</Text>

                <TouchableOpacity
                    onPress={() => console.log('Button Click')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        flexDirection: 'row',
                        backgroundColor: Colors.WHILE,
                        padding: 10,
                        paddingHorizontal: 50,
                        borderRadius: 99,
                        position: 'absolute',
                        bottom: 150
                    }}>
                    <Image source={require('./../../../assets/images/google.png')} style={{
                        width: 50,
                        height: 50
                    }} />
                    <Text style={{
                        fontFamily: 'outfit'
                    }}>Sign In with Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    video: {
        height: '100%',
        width: 1000,
        position: 'adsolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})