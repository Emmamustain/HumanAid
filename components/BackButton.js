import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export function BackButton ({color="blue", onPress}) {

    const navigation = useNavigation();
    return(
        <TouchableOpacity style={styles.container} onPress={()=> onPress ? onPress() : navigation.goBack()}>
            <Icon name="arrow-back" size={30} color={color}/>
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({
    container: {
        marginTop: 2
    }
})