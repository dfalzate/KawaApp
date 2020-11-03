import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useForm } from 'react-hook-form'

interface LoginProps{
    onSubmit:(data:any)=>void
}

const LoginComponent:React.FC<LoginProps> = (props:any) => {
    
    const { handleSubmit, register, setValue } = useForm();  

    React.useEffect(() => {
        register('user')
        register('password')
      },[register])

    return (
        <View>
            <TextInput
                style={styles.textInput}
                placeholder='User'
                onChangeText={text => {
                    setValue('user',text);
                }}
                />
            <TextInput
                style={styles.textInput}
                placeholder='Password'        
                onChangeText={ text =>
                    setValue('password',text)
                }                    
            />
            <View style={styles.buttons}>
            <TouchableOpacity          
                style={styles.button}
                onPress={handleSubmit(props.onSubmit)}          
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}          
                onPress={() => console.log('Cancel')}          
            >
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>   
            </View>  
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
      width: 300,
      borderBottomWidth: 1,
      marginBottom: 20,
      color: 'white',
      fontSize: 20    
    },
    buttons: {
      width: 300,    
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop:10,
    },
    button: {
      width: '45%',
      height: 40,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      shadowColor: 'gray',    
    },
    buttonText: {
      fontSize: 18,
    }
  });

export default LoginComponent;