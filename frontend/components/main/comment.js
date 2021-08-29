import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, Button, TextInput, Image } from 'react-native'
import { Avatar } from "react-native-paper"

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions'

import { MaterialCommunityIcons } from 'react-native-vector-icons';

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    const [like, setLike] = useState(props.route.params.currentUserLike)
    const [likesCount, setLikesCount] = useState(props.route.params.likesCount)
    const [height, setHeight] = useState(24)

    const commentInput = useRef();

    useEffect(() => {
        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator);
                if (user === undefined) {
                    props.fetchUsersData(comments[i].creator)
                } else {
                    comments[i].user = user;
                }
            }
            setComments(comments)
        }

        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .get()
            .then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                matchUserToComment(comments)
            })
        setPostId(props.route.params.postId)
        commentInput.current.clear()
    }, [props.route.params.postId, props.users, postId])

    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
        setPostId("")
    }

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
        setLikesCount(likesCount + 1);
        setLike(true);
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
        setLikesCount(likesCount - 1);
        setLike(false);
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <View>
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
                        }}>{props.route.params.user}</Text>
                </View>
                <Image
                    style={{
                        width: 360,
                        height: 360,
                    }}
                    source={{ uri: props.route.params.uri }} />
                <View style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    paddingBottom: "4px",
                    paddingTop: "14px",
                    paddingLeft: "14px"
                }}>
                    {like ?
                        (
                            <MaterialCommunityIcons
                                name="cards-heart"
                                color="#313131"
                                size={30}
                                onPress={() => onUnLikePress(props.route.params.uid, props.route.params.postId)} />
                        ) :
                        <MaterialCommunityIcons
                            name="heart-outline"
                            color="#313131"
                            size={30}
                            onPress={() => onLikePress(props.route.params.uid, props.route.params.postId)} />
                    }
                    <MaterialCommunityIcons
                        name="chat-outline"
                        style={{ transform: [{ rotateY: '180deg' }], marginLeft: 6 }}
                        color="#313131"
                        size={30}
                        onPress={() => props.navigation.navigate('Comment')}
                    />
                </View>
                <Text style={{
                    alignSelf: 'flex-start',
                    fontWeight: "600",
                    paddingLeft: "14px",
                    justifyContent: "center",
                    alignItems: "baseline",
                }}>{likesCount} Likes</Text>
                {props.route.params.caption !== "" ?
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
                                }}>{props.route.params.user}</Text>
                            <Text>{props.route.params.caption}</Text>
                        </View>
                    ) : <> </>}
                <FlatList
                    style={{
                        alignSelf: "flex-start",
                    }}
                    numColumns={1}
                    horizontal={false}
                    data={comments}
                    renderItem={({ item }) => (
                        <View style={{
                            alignSelf: "flex-start",
                            flexDirection: "row",
                            paddingLeft: "14px",
                            paddingTop: "4px"
                        }}>
                            {item.user !== undefined ?
                                <Text
                                    style={{
                                        fontWeight: "600",
                                        paddingRight: "4px"
                                    }}>{item.user.name}</Text> : <> </>}
                            <Text style={{
                                resizeMode: "contain",
                                maxWidth: 320,
                                paddingRight: 14
                            }}>{item.text}</Text>
                        </View>
                    )}
                />
                <Text style={{
                    alignSelf: "flex-start",
                    paddingLeft: "14px",
                    paddingTop: "12px",
                    fontSize: "10px",
                    letterSpacing: "0.2px",
                    color: "#8e8e8e",
                }}>{props.route.params.creationDate}</Text>
                <View style={{
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    paddingTop: "12px",
                    flexDirection: "row",
                    paddingBottom: "32px",
                    alignItems: "center",
                    justifyContent: "center",
                }}>

                    <TextInput
                        style={{
                            display: "flex",
                            height: height,
                            maxHeight: "80px",
                            flexGrow: 1,
                            alignSelf: "flex-start",
                            flex: 1
                        }}
                        multiline
                        ref={commentInput}
                        placeholder="Add a comment"
                        onContentSizeChange={e => e.nativeEvent.contentSize.height > 80 ? setHeight(80) : setHeight(e.nativeEvent.contentSize.height)}
                        onChangeText={(text) => setText(text)} />
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: "16px",
                            flex: 1 / 9,
                            alignSelf: "flex-end",
                            marginLeft: "12px",
                            color: "#0095f6"
                        }}
                        onPress={() => onCommentSend()}>Post</Text>

                </View>
            </View>

        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment);
