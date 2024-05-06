import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from './../../Utils/Colors'
import { Ionicons } from '@expo/vector-icons';

export default function VideoThumbnailItem({ video }) {
    return (
        <View style={{ flex: 1, margin: 5 }}>
            <View style={{
                position: 'absolute', zIndex: 10, bottom: 0, padding: 5,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'
            }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Image source={{ uri: video?.Users?.profileImage }}
                        style={{ width: 20, height: 20, backgroundColor: Colors.WHILE, borderRadius: 99 }}
                    />
                    <Text style={{
                        color: Colors.WHILE,
                        fontFamily: 'outfit',
                        fontSize: 12
                    }}>{video?.Users?.name}</Text>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 12, color: Colors.WHILE
                    }}>36</Text>
                    <Ionicons name="heart-outline" size={24} color="white" />
                </View>
            </View>
            <Image source={{ uri: video?.thumbnail }}
                style={{ width: '100%', height: 250, borderRadius: 10 }}
            />
        </View>
    )
}