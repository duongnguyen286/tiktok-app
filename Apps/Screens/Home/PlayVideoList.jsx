import { View, Text, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import PlayVideoListItem from './PlayVideoListItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './../../Utils/SupabaseConfig'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useUser } from '@clerk/clerk-expo';


export default function PlayVideoList() {
    const params = useRoute().params;
    const [videoList, setVideoList] = useState([])
    const navigation = useNavigation()
    const [loading, setLoading] = useState();
    const [currentVideoIndex, setcurrentVideoIndex] = useState();
    const { user } = useUser()
    const WindowHeight = Dimensions.get('window').height;
    const BottomTabHeight = useBottomTabBarHeight();


    // useEffect(() => {
    //     setVideoList([params.selectedVideo]);
    //     GetLatestVideoList();
    // }, [])

    useEffect(() => {
        if (params.selectedVideo) {
            setVideoList([params.selectedVideo]);
        }
        GetLatestVideoList();
    }, [])

    // const GetLatestVideoList = async () => {
    //     setLoading(true);
    //     try {
    //         const { data, error } = await supabase
    //             .from('PostList')
    //             .select('*,Users(username, name, profileImage, email),VideoLikes(postIdRef, userEmail)')
    //             .range(0, 7)
    //             .order('id', { ascending: false });

    //         if (error) {
    //             console.error('Error fetching data:', error.message);
    //             return;
    //         }

    //         if (data) {
    //             console.log('Data', data);
    //             setVideoList(videoList => [...videoList, ...data]);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error.message);
    //     }
    // }

    const GetLatestVideoList = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('PostList')
                .select('*,Users(username, name, profileImage, email),VideoLikes(postIdRef, userEmail)')
                .range(0, 7)
                .order('id', { ascending: false });

            if (error) {
                console.error('Error fetching data:', error.message);
                return;
            }

            if (data) {
                console.log('Data', data);
                setVideoList(prevList => [...prevList, ...data.filter(item => prevList.every(video => video.id !== item.id))]);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }

    const userLikeHandler = async (videoPost, isLike) => {
        if (!isLike) {
            const { data, error } = await supabase
                .from('VideoLikes')
                .insert([{
                    postIdRef: videoPost.id,
                    userEmail: user.primaryEmailAddress.emailAddress
                }])
            // console.log(error, data)
            GetLatestVideoList()
        }
        else {
            const { error } = await supabase
                .from('VideoLikes')
                .delete()
                .eq('postIdRef', videoPost.id)
                .eq('userEmail', user?.primaryEmailAddress.emailAddress)
            GetLatestVideoList()
        }
    }


    // console.log("dữ liệu>>>", videoList)
    // console.log("Length của videoList>>>", videoList.length)
    return (
        <View>
            <TouchableOpacity style={{ position: 'absolute', zIndex: 10, padding: 20, paddingTop: 50 }}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <FlatList
                data={videoList}
                showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
                style={{ zIndex: -1 }}
                pagingEnabled
                onScroll={e => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / (WindowHeight - BottomTabHeight))
                    setcurrentVideoIndex(index)
                }}
                renderItem={({ item, index }) => (
                    <PlayVideoListItem video={item} key={index}
                        index={index}
                        activeIndex={currentVideoIndex}
                        userLikeHandler={userLikeHandler}
                        user={user}
                    />
                )}
            />
        </View>
    )
}