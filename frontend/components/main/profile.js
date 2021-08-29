import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { Avatar } from 'react-native-paper';

require('firebase/firestore')

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const { currentUser, posts } = props;
        console.log({ currentUser, posts });
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        } else {
            firebase.firestore()
                .collection('users')
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data())
                    } else {
                        console.log(firebase.auth().currentUser.uid)
                        console.log("does not exist")
                    }
                })
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {
                            id,
                            ...data
                        }
                    })
                    setUserPosts(posts)
                })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
            console.log(following)
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .doc(props.route.params.uid)
            .set({})
    }

    const onUnFollow = () => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .doc(props.route.params.uid)
            .delete()
    }

    const logOut = () => {
        firebase.auth().signOut();
    }

    if (user === null) {
        return <View />
    }

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={{ marginLeft: "20px", flexDirection: "row" }}>
                    <Avatar.Image size={72} source={require('../../images/avatar.png')} />
                    <View style={{
                        maxHeight: 72,
                        height: 72,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "20px",
                        marginRight: "20px",
                        flex: 1
                    }}>
                        <Text style={{ fontSize: "24px", fontWeigth: "300", marginBottom: "8px" }}>{user.name}</Text>
                        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                            <View style={{ flex: 1, alignSelf: "stretch" }}>
                                {following ? (
                                    <TouchableOpacity style={styles.logoutButton} onPress={onUnFollow}>
                                        <View>
                                            <Text style={{ color: '#000', fontSize: "16px", fontWeight: 600, textAlign: "center" }}>Following</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.logoutButton} onPress={onFollow}>
                                        <View>
                                            <Text style={{ color: '#000', fontSize: "12px", fontWeight: 600, textAlign: "center" }}>Follow</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) :
                            <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
                                <View>
                                    <Text style={{ color: '#000', fontSize: "16px", fontWeight: 600, textAlign: "center" }}>Log out</Text>
                                </View>
                            </TouchableOpacity>}
                    </View>
                </View>
                <View style={{ marginLeft: "20px", marginTop: "20px" }}>
                    <Text style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>Bio</Text>
                    <Text style={{ fontSize: "14px" }}>Hi, welcome to my instagram clone page</Text>
                </View>
            </View>

            <View
                style={{
                    borderBottomColor: '#dbdbdb',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    border: "1px solid transparent",
                    marginBottom: 7,
                    marginTop: 20,
                    alignSelf: "stretch"
                }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                <View style={{ flex: 1 / 3, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={{ fontWeight: "600", fontSize: "16px" }}>{userPosts.length}</Text>
                    <Text style={{ color: "#959595" }}>posts</Text>
                </View>

                <View style={{ flex: 1 / 3, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={{ fontWeight: "600", fontSize: "16px" }}>{userPosts.length}</Text>
                    <Text style={{ color: "#959595" }}>followers</Text>
                </View>

                <View style={{ flex: 1 / 3, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={{ fontWeight: "600", fontSize: "16px" }}>{userPosts.length}</Text>
                    <Text style={{ color: "#959595" }}>following</Text>
                </View>
            </View>

            <View
                style={{
                    borderBottomColor: '#dbdbdb',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    border: "1px solid transparent",
                    marginBottom: 20,
                    marginTop: 7,
                    alignSelf: "stretch"
                }}
            />

            <View style={styles.galleryContainer}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{ uri: item.downloadUrl }} />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    infoContainer: {
    },
    galleryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1 / 3,
        padding: "1px",
    },
    image: {
        width: 120,
        height: 120,
    },
    logoutButton: {
        backgroundColor: '#F2F2F2',
        border: "1px solid",
        color: "#dbdbdb",
        borderRadius: "4px",
        height: "32px",
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center"
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
});

export default connect(mapStateToProps, null)(Profile);