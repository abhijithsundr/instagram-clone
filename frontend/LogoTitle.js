import React from 'react';
import { Image } from "react-native";

export default function LogoTitle() {
    return (
        <Image
            style={{
                flex: 1, 
                justifyContent: "flex-start",
                alignSelf: "flex-start",
                marginLeft: "-60px",
                width: 240,
                height: 40, 
                resizeMode: "contain"
            }}
            source={require('./images/instagram_logo.svg')}
        />
    )
}
