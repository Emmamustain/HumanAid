import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import { Button } from './Button';

export const categories = [["Wheels", "#00A36C"], ["Beds", "#E55451"], ["Oxygen","#FF8C00"], ["Walking aids","#77BFC7"], ["Test COVID","#00A36C"], ["Test2","#E55451"], ["Test3","#FF8C00"], ["Test4","#77BFC7"]]

//Don't forget to change the name of the function
export default function Categories({db, user}) {

    const navigation = useNavigation();

    const handleFilterPress = (category) => {
        navigation.navigate("CategoryItems", {category:category, db: db, user:user});
    }

  return (
    <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>
        {
            categories.map((value)=>
             <View key={value}>
                <Button text={value[0]} bold={false} style={{height: 40, marginTop: 5, width:90, marginLeft: 5, marginRight:5, borderRadius: 7, backgroundColor: value[1] ? value[1] : "#3F7FB8"}} press={()=>handleFilterPress(value[0].toLowerCase())}/>
             </View>
                
            )
        }
    </ScrollView>
  );
}


const styles= StyleSheet.create({
    container: {
        flex:1,
        maxHeight:50,
        width: "95%",
    },
})