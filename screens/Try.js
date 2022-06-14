import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import {vh, vw} from 'react-native-expo-viewport-units';
import { Timestamp } from 'firebase/firestore';
import Reg from './Reg';
import { Button } from '../components/Button';
import { getFirestore, collection, getDoc, getDocs, doc, addDoc, setDoc, DocumentData, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';





export default function Try({db, user}) {

  const navigation = useNavigation();


  const [name, onChangeName] = useState("");
  // const [owner, onChangeOwner] = useState("");
  const [adress, onChangeAdress] = useState("");
  const [email, onChangeEmail] = useState("");
  // const [date, onChangeDate] = useState("");
  const [code, onChangeCode] = useState(null);
  const [phone, onChangePhone] = useState(null);
  const [member, onChangeMember] = useState(null);

  const [step, setStep] = useState(0);

  function next() {
    if(step<2){
      setStep(step+1);
    }
    else{
      triggerSubmit();
      setStep(step+1);
    }
  }

  useEffect(()=>{
    setStep(0);
  }, [])


  const addAssociation = async() => {
    if(user){
        let nameAsArray = [];
        const nameAsCharacters = [...name.toLowerCase()];
        
        let x = 0;
        for(let i=0; i<nameAsCharacters.length; i++){
            if(i>0){
                if(nameAsCharacters[i] !== " "){
                    nameAsArray.push(nameAsArray[x-1] + nameAsCharacters[i]);
                    
                }
                else{
                    i++;
                    console.log(nameAsCharacters[i])
                    nameAsArray.push(nameAsCharacters[i]);
                }
            }
            else{
                nameAsArray.push(nameAsCharacters[i]);
            }
            x++;
        }

        nameAsArray.push(name.toLowerCase());

      const docRef = await addDoc(collection(db, "associations"), {
        name: name,
        // image: downloadURL,
        nameAsArray: nameAsArray,
        address: adress,
        phone: phone,
        code: code,
        email: email,
        members: member,
        owner: user.uid,
        created: Timestamp.now(),
      });
      console.log("Document written with ID: ", docRef.id);

      const userDataRef = doc(db, "users", user.uid);
      await updateDoc(userDataRef, {
          isAssociation: true,
          associationOwned: arrayUnion(docRef.id),
      });
      return 1;
  }
  else{
    alert("no user, clear cache and login with google!");
    return 0;
  }
}


async function triggerSubmit(){
  let result = await addAssociation();
  if(result === 1){
      navigation.goBack()
  }
  else{
      alert("An Error Has Occured!")
  }

}

 
  return (
    <View style={styles.container}>
      
      <Reg/>
      
      {
      
      step === 1 ?
        <View>
          
          {/* <TextInput
            style={styles.input}
            onChangeText={onChangeOwner}
            placeholder="Name of the owner"
            value={owner}
            borderRadius={7}
          /> */}
         <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          placeholder="E-mail"
          value={email}
          borderRadius={7}
        />
         <TextInput
            style={styles.input}
            onChangeText={onChangePhone}
            value={phone}
            placeholder="Phone number"
            keyboardType="numeric"
            borderRadius={7}
          />
          
      </View>
      :
       step === 0 ? 
      <View>
        <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            placeholder="Name of the association"
            value={name}
            borderRadius={7}
          />
           <TextInput
            style={styles.input}
            onChangeText={onChangeAdress}
            placeholder="The adress"
            value={adress}
            borderRadius={7}
          />
       <TextInput
          style={styles.input}
          onChangeText={onChangeCode}
          value={code}
          placeholder="Code association"
          keyboardType="numeric"
          borderRadius={7}
          />
        
      </View>
        :
        <View>
          {/* <TextInput
          style={styles.input}
          onChangeText={onChangeDate}
          placeholder="Date of opening"
          value={date}
          borderRadius={7}
        /> */}
          <TextInput
            style={styles.input}
            onChangeText={onChangeMember}
            value={member}
            placeholder="Number of the members  "
            keyboardType="numeric"
            borderRadius={7}
          />
        </View>
  }

    {step < 3 ? <Button text={step===2 ? "Finish" : 'Next'} style={{height: 40, marginTop: 50, width:150, marginLeft: 5, marginRight:5, borderRadius: 7, backgroundColor:"black"}} press={next}/> : <></>}

   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
    width: vw(100)
  },

  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    // padding: 25,
    textAlign: 'center',
    width: vw(80)
  },
  
});
