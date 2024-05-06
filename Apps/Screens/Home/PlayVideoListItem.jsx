import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { Video, ResizeMode } from 'expo-av';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function PlayVideoListItem({ video, activeIndex, index }) {
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const BottomTabHeight = useBottomTabBarHeight();

    // const ScreenHeight = Dimensions.get('window').height - BottomTabHeight;
    const ScreenHeight = Dimensions.get('window').height;

    return (
        <View >
            <View style={{
                position: 'absolute', zIndex: 10, bottom: 20, padding: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'flex-end'
            }}>
                <View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <Image source={{ uri: video?.Users.profileImage }}
                            style={{
                                width: 40, height: 40,
                                backgroundColor: Colors.WHILE, borderRadius: 99
                            }}
                        />
                        <Text style={{
                            fontFamily: 'outfit', fontSize: 16, color: Colors.WHILE
                        }}>{video.Users.name}</Text>
                    </View>
                    <Text style={{
                        fontFamily: 'outfit', fontSize: 16, color: Colors.WHILE, marginTop: 7
                    }}>{video.description}</Text>
                </View>
                <View style={{ display: 'flex', gap: 15 }}>
                    <Ionicons name="heart-outline" size={40} color="white" />
                    <Ionicons name="chatbubble-outline" size={35} color="white" />
                    <Ionicons name="paper-plane-outline" size={35} color="white" />
                </View>
            </View>
            <Video
                ref={videoRef}
                style={[styles.video, { height: ScreenHeight }]}
                source={{
                    uri: video?.videoUrl,
                }}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={activeIndex == index}
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        width: Dimensions.get('window').width
    }
})
