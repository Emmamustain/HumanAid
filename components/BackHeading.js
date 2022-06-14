import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextStyle, } from 'react-native';

import { BackButton } from './BackButton';



export function BackHeading({text, color, pos, top, mt, mb, fs}) {
    
    const styles = StyleSheet.create({
        container:{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 0,
            marginBottom: mb ? mb : 0,
            position: pos ? pos : "relative",
            top: top ? top : 0,
            marginTop: mt ? mt : 50,
            width: "85%",
            zIndex:4,
        },
        text: {
            fontSize: fs ? fs : 21,
            marginLeft: 10,
            color: color ? color : 'black',
        }
    })

    return(
        <View style={styles.container}>
            <BackButton color={color ? color : "black"}/>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}