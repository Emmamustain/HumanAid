import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import WheelChairImg from '../images/wheelchair.png'

const mostRequested = [
    {
        name:"Wheel Chair",
        stock: 8,
        color: "#EBF1F4"
    
    },
    {
        name:"Electric Roller",
        stock: 12,
        color: "#EDEBF4"
    
    },
    {
        name:"Something Else",
        stock: 8,
        color: "#F3EBF4"
    
    },
    {
        name:"Something Else",
        stock: 1,
        color: "#F4EBED"
    
    }

]


export default function MostRequested() {

  return (
    <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>
        {
            mostRequested.map((value, index)=>
                <ItemCard key={index} text={value.name} image={WheelChairImg} stock={value.stock} bgc={value.color}/>               
            )
        }
    </ScrollView>
  );
}


const styles= StyleSheet.create({
    container: {
        flex:1,
        marginLeft: "5%",
        marginTop: 10
    },
})

function ItemCard({image, text, stock, bgc="#EBF1F4"}) {
    return(
        <View style={{...itemCardStyles.container, backgroundColor:bgc}}>
            <View style={{width:"100%", display:"flex", alignItems:"center"}}>
                <Image source={image}/>
            </View>
            <Text style={itemCardStyles.title}>{text}</Text>
            <Text style={itemCardStyles.stock}>Available: {stock}</Text>
        </View>
    )
}


const itemCardStyles= StyleSheet.create({
    container: {
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 200,
        borderRadius: 10,
        width: 150,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10
        // alignItems: "center"
    },
    title: {
        fontWeight: "700",
        fontSize: 14,
        marginTop: 5,
        
    },
    stock: {
        fontWeight: "normal",
        fontSize: 9,
    }
})