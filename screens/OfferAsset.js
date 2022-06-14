import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import Reg from "./Reg";
import { Button } from "../components/Button";

import { Timestamp } from "firebase/firestore";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
  addDoc,
  setDoc,
  DocumentData,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { categories } from "../components/Categories";

export default function OfferAsset({ db, user }) {
  const navigation = useNavigation();

  const [name, onChangeName] = useState("");
  const [description, onChangeDescription] = useState("");
  const [address, onChangeAddress] = useState("");
  const [category, setCategory] = useState(undefined);
  const [phone, onChangePhone] = useState(null);
  const [stock, onChangeStock] = useState(null);
  const [image, setImage] = useState(null);

  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [downloadURL, setDownloadURL] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      let fileNameArray = result.uri.split("/");
      setFileName(fileNameArray[fileNameArray.length - 1]);
    }
  };

  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const storage = getStorage();
    const storageRef = ref(storage, "images/" + fileName);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    let UploadResult = "notSet";

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploading(true);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            setUploading(true);
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        setUploading(false);
        setUploaded(true);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          console.log(downloadURL);
          blob.close();
        });
      }
    );
  };

  const [step, setStep] = useState(0);

  async function next() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      uploadImage();
    }
  }

  async function triggerSubmit() {
    let result = await addAsset();
    if (result === 1) {
      navigation.goBack();
    } else {
      alert("An Error Has Occured!");
    }
  }

  //Submitting using the useEffect
  useEffect(() => {
    if (downloadURL) {
      triggerSubmit();
    }
  }, [downloadURL]);

  useEffect(() => {
    setStep(0);
  }, []);

  const addAsset = async () => {
    if (user) {
      let nameAsArray = [];
      const nameAsCharacters = [...name.toLowerCase()];

      let x = 0;
      for (let i = 0; i < nameAsCharacters.length; i++) {
        if (i > 0) {
          if (nameAsCharacters[i] !== " ") {
            nameAsArray.push(nameAsArray[x - 1] + nameAsCharacters[i]);
          } else {
            i++;
            console.log(nameAsCharacters[i]);
            nameAsArray.push(nameAsCharacters[i]);
          }
        } else {
          nameAsArray.push(nameAsCharacters[i]);
        }
        x++;
      }

      nameAsArray.push(name.toLowerCase());

      const docRef = await addDoc(collection(db, "assets"), {
        name: name,
        image: downloadURL,
        nameAsArray: nameAsArray,
        address: address,
        phone: phone,
        category: category,
        stock: stock,
        description: description,
        owner: user.uid,
        created: Timestamp.now(),
        available: true,
      });
      console.log("Document written with ID: ", docRef.id);

      const userDataRef = doc(db, "users", user.uid);
      await updateDoc(userDataRef, {
        itemsOffered: arrayUnion(docRef.id),
      });
      return 1;
    } else {
      alert("no user, clear cache and login with google!");
      return 0;
    }
  };

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: categories[0][0], value: categories[0][0].toLowerCase() },
    { label: categories[1][0], value: categories[1][0].toLowerCase() },
    { label: categories[2][0], value: categories[2][0].toLowerCase() },
    { label: categories[3][0], value: categories[3][0].toLowerCase() },
    { label: categories[4][0], value: categories[4][0].toLowerCase() },
    { label: categories[5][0], value: categories[5][0].toLowerCase() },
    { label: categories[6][0], value: categories[5][0].toLowerCase() },
    { label: categories[7][0], value: categories[5][0].toLowerCase() },
  ]);

  return (
    <View style={styles.container}>
      <Reg title={"Offer Asset"} />

      {step === 0 ? (
        <View style={styles.formContainer}>
          {image ? (
            !uploading ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <ActivityIndicator size="large" color="black" />
            )
          ) : (
            <View style={styles.imagePreview} />
          )}
          {!image ? (
            <Button
              text="   Select Image   "
              press={pickImage}
              style={{
                height: 40,
                marginTop: 10,
                width: 150,
                marginLeft: 5,
                marginRight: 5,
                borderRadius: 7,
                backgroundColor: "black",
              }}
            />
          ) : (
            <Button
              text={step === 3 ? "Finish" : "Next"}
              style={{
                height: 40,
                marginTop: 50,
                width: 150,
                marginLeft: 5,
                marginRight: 5,
                borderRadius: 7,
                backgroundColor: "black",
              }}
              press={next}
            />
          )}
        </View>
      ) : step === 1 ? (
        <View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            placeholder="Name of the asset"
            value={name}
            borderRadius={7}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeDescription}
            placeholder="Description and state of asset"
            value={description}
            borderRadius={7}
          />
        </View>
      ) : step === 2 ? (
        <View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeAddress}
            placeholder="The address"
            value={address}
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
      ) : (
        <View>
          <View style={{ width: "90%" }}>
            <DropDownPicker
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="Select the Category"
              style={{ marginBottom: 10 }}
              maxHeight={300}
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={(val) => onChangeStock(+val)}
            placeholder="Stock"
            value={stock}
            borderRadius={7}
            keyboardType="numeric"
          />
        </View>
      )}

      {step !== 0 && step <= 3 ? (
        <Button
          text={step === 3 ? "Finish" : "Next"}
          style={{
            height: 40,
            marginTop: 50,
            width: 150,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 7,
            backgroundColor: "black",
          }}
          press={next}
        />
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    // justifyContent: 'center',
    width: vw(100),
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // marginTop: "10%",
  },
  imagePreview: {
    width: "90%",
    height: 300,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    // padding: 25,
    textAlign: "center",
    width: vw(80),
  },
});
