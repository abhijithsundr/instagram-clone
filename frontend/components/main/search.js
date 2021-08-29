import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
import { Avatar } from 'react-native-paper';

require('firebase/firestore')

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .where('name', '<=', search+ '\uf8ff')
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...data
                    }
                })
                setUsers(users);
            })
    }

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: 360
            }}>
            <View style={{
                borderBottomColor: "#dbdbdb",
                borderBottomWidth: 1,
                border: "1px solid transparent",
                padding: "14px",
                width: 360,
                alignSelf: "flex-start"
            }}>
                <TextInput
                    style={{
                        borderRadius: "2px",
                        border: "1px solid",
                        borderColor: "#dbdbdb",
                        alignSelf: "stretch",
                        padding: "2px",
                        paddingLeft: "12px",
                        height: "28px"
                    }}
                    placeholder="Search"
                    onChangeText={(search) => search === "" ? setUsers([]) : fetchUsers(search)} />

            </View>
            <FlatList
                style={{
                    position: 'relative',
                    alignSelf: "flex-start",
                    padding: "14px"
                }}
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <View>
                        <View style={{
                            alignSelf: "flex-start",
                            flexDirection: "row",
                            paddingBottom: "14px",
                            paddingTop: "14px",
                            paddingLeft: "14px"
                        }}>
                            <Avatar.Image style={{}} size={30} source={require('../../images/avatar.png')} />
                            <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.id })}>
                                <Text style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    paddingLeft: "14px",
                                    paddingTop: "4px"
                                }}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}
