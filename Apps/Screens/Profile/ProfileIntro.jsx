import { View, Text, Image } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import Colors from './../../Utils/Colors'
import { Ionicons } from '@expo/vector-icons';

export default function ProfileIntro() {
    const { user } = useUser()
    return (
        <View style={{ marginTop: 30 }}>

            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 24
            }}>Profile</Text>

            <View style={{ alignItems: 'center' }}>
                <Image source={{ uri: user.imageUrl }}
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: 99
                    }}
                />
                <Text style={{
                    fontSize: 22,
                    fontFamily: 'outfit-medium'
                }} >{user?.fullName}
                </Text>
                <Text style={{
                    fontSize: 17,
                    fontFamily: 'outfit',
                    color: Colors.BACKGROUND_TRANSNP
                }} >{user?.primaryEmailAddress?.emailAddress}
                </Text>

            </View>
            <View style={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Ionicons name="videocam" size={24} color="black" />
                    <Text style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 20
                    }}>12 Post</Text>
                </View>
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Ionicons name="heart" size={24} color="black" />
                    <Text style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 20
                    }}>286286 Likes</Text>
                </View>
            </View>
        </View>
    )
}