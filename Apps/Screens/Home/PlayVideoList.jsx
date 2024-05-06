import { View, Text, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import PlayVideoListItem from './PlayVideoListItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './../../Utils/SupabaseConfig'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';


export default function PlayVideoList() {
    const params = useRoute().params;
    const [videoList, setVideoList] = useState([])
    const navigation = useNavigation()
    const [loading, setLoading] = useState();
    const [currentVideoIndex, setcurrentVideoIndex] = useState();
    const WindowHeight = Dimensions.get('window').height;
    const BottomTabHeight = useBottomTabBarHeight();


    useEffect(() => {
        setVideoList([params.selectedVideo]);
        GetLatestVideoList();
    }, [])

    const GetLatestVideoList = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('PostList')
            .select('*,Users(username, name, profileImage)')
            .range(0, 7)
            .order('id', { ascending: false })
        setVideoList(videoList => [...videoList, ...data]);

        if (data) {
            setLoading(false)
        }
    }
    console.log("dữ liệu>>>", videoList)
    console.log("Length của videoList>>>", videoList.length)
    return (
        <View>
            <TouchableOpacity style={{ position: 'absolute', zIndex: 10, padding: 20, paddingTop: 50 }}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <FlatList
                data={videoList}
                style={{ zIndex: -1 }}
                pagingEnabled
                onScroll={e => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / (WindowHeight - BottomTabHeight))
                    setcurrentVideoIndex(index)
                }}
                renderItem={({ item, index }) => (
                    <PlayVideoListItem video={item} key={index}
                        index={index}
                        activeIndex={currentVideoIndex} />
                )}
            />
        </View>
    )
}