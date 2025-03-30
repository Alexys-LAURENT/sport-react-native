import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';


interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
}

const CustomButton = (props: CustomButtonProps) => {
  return (
    <TouchableOpacity style={{ width: '100%', backgroundColor: '#C6FF00', borderRadius: 5, paddingVertical: 12 }} onPress={props.onPress}>
      <Text style={{ color: '#212121', textAlign: 'center', fontSize: 16, fontWeight: 'semibold' }}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
