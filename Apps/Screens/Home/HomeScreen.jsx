import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { supabase } from './../../Utils/SupabaseConfig'
import VideoThumbnailItem from './VideoThumbnailItem';
import { FlatList } from 'react-native';


export default function HomeScreen() {
    const { user } = useUser();
    const [videoList, setVideoList] = useState([])

    useEffect(() => {
        user && updateProfileImage();
        GetLatestVideoList();
    }, [user])

    const updateProfileImage = async () => {
        const { data, error } = await supabase
            .from('Users')
            .update({ 'profileImage': user?.imageUrl })
            .eq('email', user?.primaryEmailAddress?.emailAddress)
            .is('profileImage', null)
            .select();

    }

    const GetLatestVideoList = async () => {
        const { data, error } = await supabase
            .from('PostList')
            .select('*,Users(username, name, profileImage)')
            .range(0, 9);
        setVideoList(data);
        console.log(data)
        console.log(">>>", error)
    }



    return (
        <View style={{ padding: 50 }}>
            <View style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Text style={{ fontSize: 30, fontFamily: 'outfit-bold' }}>PTIT TOK</Text>
                <Image source={{ uri: user?.imageUrl }}
                    style={{ width: 50, height: 50, borderRadius: 99 }}
                />
            </View>
            <View>
                <FlatList
                    data={videoList}
                    renderItem={({ item, index }) => (
                        <VideoThumbnailItem video={item} />
                    )}
                />
            </View>
        </View>
    )
}