import { Href, Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  bottomLink?: {
    text: string;
    url : Href
  },
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const CustomTextInput = (props : CustomInputProps) => {
  return (
    <View style={{flexDirection: 'column', width: '100%', gap : 4}}>
      {
        props.label && <Text style={styles.textStyle}>{props.label}</Text>
      }
    <TextInput
        placeholder={props.placeholder ? props.placeholder : ''}
        placeholderTextColor="#727272" 
        secureTextEntry={props.isPassword ? true : false}
        style={[styles.input, { color: "white" }]}
        onChangeText={props.onChangeText ? props.onChangeText : () => {}}
        value={props.value ? props.value : ''}
        keyboardType={props.keyboardType ? props.keyboardType : 'default'}
        autoCapitalize={props.autoCapitalize ? props.autoCapitalize : 'sentences'}
    />
    {
      props.bottomLink && 
      <Link style={{color:'white'}} href={props.bottomLink.url}>
          {props.bottomLink.text}
      </Link>
    }
</View>
  );
};

export default CustomTextInput;


const styles = StyleSheet.create({
  input: {
      backgroundColor:'#1E2021',
      width: '100%',
      height: 50,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textStyle: {
      color: 'white',
  },
});