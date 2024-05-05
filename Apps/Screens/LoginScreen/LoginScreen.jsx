import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import Colors from '../../Utils/Colors';
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';
import { supabase } from './../../Utils/SupabaseConfig';

WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
    useWarmUpBrowser;

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow();

            if (createdSessionId) {
                setActive({ session: createdSessionId });
                if (signUp?.emailAddress) {

                    const { data, error } = await supabase
                        .from('Users')
                        .insert([
                            {
                                name: signUp?.firstName,
                                email: signUp?.emailAddress,
                                username: (signUp?.emailAddress).split('@')[0]
                            },
                        ])
                        .select()

                    if (data) {
                        console.log(data)
                    }

                }
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

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
                    onPress={onPress}
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