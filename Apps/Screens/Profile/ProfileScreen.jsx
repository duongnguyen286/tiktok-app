import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileIntro from './ProfileIntro'
import { supabase } from './../../Utils/SupabaseConfig'
import { useUser } from '@clerk/clerk-expo'
import UserPostList from './UserPostList'

export default function ProfileScreen() {

    const { user } = useUser();
    const [postList, setPostList] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        user && GetUserPost()
    }, [user])

    const GetUserPost = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('PostList')
            .select('*, VideoLikes(postIdRef, userEmail), Users(*)')
            .eq('emailRef', user?.primaryEmailAddress?.emailAddress)
            .order('id', { ascending: false })
        if (data) {
            setPostList(data)
            setLoading(false)
        }
        if (error) {
            setLoading(false)
        }
        // console.log(data.length)
    }

    return (
        <View style={{ padding: 20 }}>
            <FlatList
                data={[{ id: 1 }]}
                showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
                onRefresh={() => GetUserPost()} // Khi người dùng kéo xuống, hàm getUserData sẽ được gọi để làm mới dữ liệu
                refreshing={loading} // Khi loading là true, hiển thị trạng thái làm mới
                renderItem={({ item, index }) => (
                    <View>
                        <ProfileIntro
                            postList={postList}
                        />

                        <UserPostList
                            postList={postList}
                            GetLatestVideoList={GetUserPost}
                            loading={loading}
                        />
                    </View>
                )}
            />

        </View>
    )
}