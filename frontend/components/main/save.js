import React, { useState } from 'react'
import { View, TextInput, Image, TouchableOpacity, Text, Alert } from 'react-native'
import firebase from 'firebase';

require('firebase/firestore');
require('firebase/firebase-storage');

export default function Save(props) {
    const [caption, setCaption] = useState("");
    const [height, setHeight] = useState(24);

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();
        const task = firebase
            .storage()
            .ref()
            .child(`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
            .put(blob);
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
                console.log(snapshot)
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadUrl) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .add({
                downloadUrl,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                photoSavedAlert();
                props.navigation.popToTop();
            }));
    }

    const photoSavedAlert = () => alert("Photo saved succesfully");

    return (
        <View style={{
            flex: 1,
            justfiyContent: "center",
            alignItems: "center",
            padding: "14px",
            width: 360,
            alignSelf: "center"
        }}>
            <Image
                style={{
                    aspectRatio: 1 / 1,
                    width: 360,
                    height: 360,
                }}
                source={{ uri: props.route.params.image }} />
            <TextInput
                style={{
                    height: height,
                    alignSelf: "stretch",
                    marginTop: "12px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    alignItems: "center",
                }}
                multiline
                onContentSizeChange={e => e.nativeEvent.contentSize.height > 80 ? setHeight(80) : setHeight(e.nativeEvent.contentSize.height)}
                placeholder="Give your picture a caption"
                onChangeText={(caption) => setCaption(caption)}
            />
            <TouchableOpacity
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid transparent",
                    borderRadius: "4px",
                    backgroundColor: "#0095f6",
                    height: "30px",
                    marginTop: "12px",
                    alignSelf: "stretch"
                }}
                onPress={() => uploadImage()}>
                <View>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: "12px",
                            textAlign: "center"
                        }}>Save</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
