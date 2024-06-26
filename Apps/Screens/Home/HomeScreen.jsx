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

    // const GetLatestVideoList = async () => {
    //     setLoading(true)
    //     const { data, error } = await supabase
    //         .from('PostList')
    //         .select('*,Users(username, name, profileImage),VideoLikes(postIdRef, userEmail)')
    //         .range(loadCount, loadCount + 7)
    //         .order('id', { ascending: false })
    //     setVideoList(videoList => [...videoList, ...data]);
    //     console.log(data)
    //     console.log(">>>", error)
    //     if (data) {
    //         setLoading(false)
    //     }
    // }
    // // console.log(loadCount)
    const GetLatestVideoList = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('PostList')
            .select('*,Users(username, name, profileImage),VideoLikes(postIdRef, userEmail)')
            .range(loadCount, loadCount + 7)
            .order('id', { ascending: false });

        if (error) {
            console.log("Error fetching data:", error);
            setLoading(false);
            return;
        }

        // Kiểm tra xem dữ liệu mới có trùng với dữ liệu hiện tại không
        const newData = data.filter(item => !videoList.some(existingItem => existingItem.id === item.id));



        setVideoList(prevList => [...prevList, ...newData]);
        setLoading(false);
    }


    return (
        <View style={{ padding: 20, paddingTop: 35 }}>
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
                    keyExtractor={(item, index) => index.toString()} // Cung cấp key duy nhất
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    style={{ display: 'flex' }}
                    onRefresh={GetLatestVideoList}
                    refreshing={loading}
                    onEndReached={() => setLoadCount(loadCount + 7)}
                    renderItem={({ item, index }) => (
                        <VideoThumbnailItem video={item} refreshData={console.log} />
                    )}
                />

            </View>
        </View>
    )
}
