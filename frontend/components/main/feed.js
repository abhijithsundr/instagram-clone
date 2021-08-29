import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { Avatar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

require('firebase/firestore')

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.usersFollowingLoaded === props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (uid, postId) => {
        firebase.firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postId)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .set({})
        firebase.firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(1),
            });
    }

    const onUnLikePress = (uid, postId) => {
        firebase.firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postId)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .delete()
        firebase.firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(-1),
            });
    }

    const calculateCreationDate = (seconds) => {
        if (new Date().getTime() / 1000 - seconds > 86400) {
            return `${Math.round((new Date().getTime() / 1000 - seconds) / 86400)} DAYS AGO`;
        }
        else if (new Date().getTime() / 1000 - seconds < 86400 && new Date().getTime() / 1000 - seconds > 3600) {
            return `${(Math.round(new Date().getSeconds() - seconds) / 3600)} HOURS AGO`;
        }
        else {
            return `${Math.round((new Date().getSeconds() - seconds) / 3600)} MINUTES AGO`;
        }
    }

    if(posts.length === 0) return <View><Text>Start following users to see their posts appear here.</Text></View>

    return (
        <View style={styles.feedContainer}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={posts}
                renderItem={({ item }) => (
                    <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: "14px" }}>
                        <View style={{
                            alignSelf: "flex-start",
                            flexDirection: "row",
                            paddingBottom: "14px",
                            paddingTop: "14px",
                            paddingLeft: "14px"
                        }}>
                            <Avatar.Image style={{}} size={30} source={require('../../images/avatar.png')} />
                            <Text
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    paddingLeft: "14px",
                                    paddingTop: "4px"
                                }}>{item.user.name}</Text>
                        </View>
                        <Image
                            style={styles.image}
                            source={{ uri: item.downloadUrl }} />
                        <View style={{
                            alignSelf: "flex-start",
                            flexDirection: "row",
                            paddingBottom: "4px",
                            paddingTop: "14px",
                            paddingLeft: "14px"
                        }}>
                            {item.currentUserLike ?
                                (
                                    <MaterialCommunityIcons
                                        name="cards-heart"
                                        color="#313131"
                                        size={30}
                                        onPress={() => onUnLikePress(item.user.uid, item.id)} />
                                ) :
                                <MaterialCommunityIcons
                                    name="heart-outline"
                                    color="#313131"
                                    size={30}
                                    onPress={() => onLikePress(item.user.uid, item.id)} />
                            }
                            <MaterialCommunityIcons
                                name="chat-outline"
                                style={{ transform: [{ rotateY: '180deg' }], marginLeft: 6 }}
                                color="#313131"
                                size={30}
                                onPress={() => props.navigation.navigate('Comment',
                                    {
                                        postId: item.id,
                                        uid: item.user.uid,
                                        uri: item.downloadUrl,
                                        user: item.user.name,
                                        currentUserLike: item.currentUserLike,
                                        likesCount: item.likesCount ? item.likesCount : 0,
                                        caption: item.caption,
                                        creationDate: calculateCreationDate(item.creation.seconds)
                                    })}
                            />
                        </View>
                        <Text style={{
                            alignSelf: 'flex-start',
                            fontWeight: "600",
                            paddingLeft: "14px",
                            justifyContent: "center",
                            alignItems: "baseline",
                        }}>{item.likesCount ? item.likesCount : 0} Likes</Text>
                        {item.caption !== "" ?
                            (
                                <View style={{
                                    alignSelf: "flex-start",
                                    flexDirection: "row",
                                    paddingLeft: "14px",
                                    paddingTop: "4px"
                                }}>
                                    <Text
                                        style={{
                                            fontWeight: "600",
                                            paddingRight: "4px"
                                        }}>{item.user.name}</Text>
                                    <Text>{item.caption}</Text>
                                </View>
                            ) : <> </>}
                        <Text style={{
                            alignSelf: "flex-start",
                            paddingLeft: "14px",
                            paddingTop: "12px",
                            fontSize: "10px",
                            letterSpacing: "0.2px",
                            color: "#8e8e8e",
                        }}>{calculateCreationDate(item.creation.seconds)}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    feedContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 360,
        height: 360,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
});

export default connect(mapStateToProps, null)(Feed);