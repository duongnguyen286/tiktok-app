import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { supabase } from './../../Utils/SupabaseConfig'
import VideoThumbnailItem from './VideoThumbnailItem';
import { FlatList } from 'react-native';


export default function HomeScreen() {
    const { user } = useUser();
    const [videoList, setVideoList] = useState([])
    const [loading, setLoading] = useState(false)//Lam moi du lieu
    const [loadCount, setLoadCount] = useState(0)

    useEffect(() => {
        user && updateProfileImage();
        setLoadCount(0)
    }, [user])

    useEffect(() => {
        GetLatestVideoList();
    }, [loadCount])

    const updateProfileImage = async () => {
        const { data, error } = await supabase
            .from('Users')
            .update({ 'profileImage': user?.imageUrl })
            .eq('email', user?.primaryEmailAddress?.emailAddress)
            .is('profileImage', null)
            .select();

    }

    const GetLatestVideoList = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('PostList')
            .select('*,Users(username, name, profileImage)')
            .range(loadCount, loadCount + 7)
            .order('id', { ascending: false })
        setVideoList(videoList => [...videoList, ...data]);
        console.log(data)
        console.log(">>>", error)
        if (data) {
            setLoading(false)
        }
    }
    // console.log(loadCount)


    return (
        <View style={{ padding: 30, paddingTop: 35 }}>
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
                    numColumns={2}
                    style={{ display: 'flex' }}
                    onRefresh={GetLatestVideoList}
                    refreshing={loading}
                    onEndReached={() => setLoadCount(loadCount + 7)}
                    onEndReachedThreshold={0.2}
                    renderItem={({ item, index }) => (
                        <VideoThumbnailItem video={item}
                            refreshData={console.log}
                        />
                    )}
                />
            </View>
        </View>
    )
}