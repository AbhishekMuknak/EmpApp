import React,{useState,useEffect} from 'react';
import {KeyboardAvoidingView,Text,View,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SendSMS from 'react-native-sms';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const HomeScreen=({ navigation })=> {
  const [empid, setEmpID] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount,setAmount]=useState('');

 


  const postData = async () => {
    if (phone.length != 10) {
      alert('Please insert correct contact number');
      return;
    }
    if (!empid || !name || !phone || !amount) {
      Alert.alert('Please fill all the fields !');
      return;
    }
    // console.warn(empid,name,phone,amount);
    try {
      await firestore()
        .collection('details')
        .add({
          empid,
          name,
          phone,
          amount,
        })
        .then(() => {
          Alert.alert('Data added Successfully !');
          setEmpID('');
          setName('');
          setPhone('');
          setAmount('');
        });
    } catch (err) {
      Alert.alert('something went wrong try again');
    }
    //code for sending sms
    SendSMS.send(
      {
        body: `The amount is ${amount}`,
        recipients: [phone],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true
      },
      (completed, cancelled, error) => {
        if (completed) {
          console.log('SMS Sent Completed');
        } else if (cancelled) {
          console.log('SMS Sent Cancelled');
        } else if (error) {
          console.log('Some error occured');
        }
      },
    );
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="empid"
          value={empid}
          onChangeText={text => setEmpID(text)}
        />
      <TextInput
          style={styles.input}
          placeholder="name"
          value={name}
          onChangeText={text => setName(text)}
        />
      <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="phone"
          value={phone}
          onChangeText={text => setPhone(text)}
        />
      <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="amonut"
          value={amount}
          onChangeText={text => setAmount(text)}
        />
        <TouchableOpacity
          onPress={()=>postData()}
          style={styles.buttonStyle}
          >
            <Text style={styles.text}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Reports')}
          style={styles.buttonStyle}
          >
            <Text style={styles.text}>Show Report</Text>
        </TouchableOpacity>

    </KeyboardAvoidingView>
    </ScrollView>
  );
}

const DetailsScreen=({ navigation })=> {
  const [items, setItems] = useState([]);

  const showReport=async()=>{
    const querySnap = await firestore().collection('details').get();
    const result = querySnap.docs.map(docSnap => docSnap.data());
    // console.log(result)
    setItems(result);
 }

 useEffect(() => {
   showReport();
 }, []);

 const renderItem=item=>{
   return(
    <View style={styles.detailsConatiner}>
        <View style={styles.textContainer}>
          <Text style={styles.detailText}>EmpId:</Text>
          <Text style={styles.detailText}>{item.empid}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.detailText}>Name:</Text>
          <Text style={styles.detailText}>{item.name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.detailText}>Mobile No:</Text>
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.detailText}>Amount:</Text>
          <Text style={styles.detailText}>{item.amount}</Text>
        </View>
    </View>
   )
 }

  return (
    <View >
        <FlatList
        data={items}
        keyExtractor={item => item.phone}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
}

const Stack=createStackNavigator();

const App=()=>{
  return(
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Add Employee" component={HomeScreen} />
          <Stack.Screen name="Reports" component={DetailsScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;

const styles=StyleSheet.create({
  scrollStyle:{
    flex:1,
  },
  container:{
    flex:1,
    justifyContent: 'center',
    // alignItems:'center'
  },
  buttonStyle:{
    height: 40,
    width:'90%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red',
    borderRadius:30,
    alignSelf:'center',
    marginTop:20
  },
  input: {
    height: 40,
    width:'90%',
    borderWidth: 1,
    borderRadius:30,
    borderColor:'red',
    alignSelf:'center',
    marginTop:20
  },
  text:{
    fontSize:16,
    color:'white'
  },
  headerText:{
    fontSize:22,
    fontWeight:'bold',
    color:'red',
    alignSelf:'center'
  },
  detailsConatiner:{
    margin:10,
    elevation:5,
    backgroundColor:'white',
    borderRadius:10,
    padding:10
  },
  textContainer:{
     flexDirection:'row',
     alignItems:'center'
  },
  detailText:{
    fontSize:22
  }
 
})


//8788375324