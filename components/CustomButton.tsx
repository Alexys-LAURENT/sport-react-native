import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';


interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

const CustomButton = (props: CustomButtonProps) => {
  return (
    <TouchableOpacity 
      style={props.variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary}
      onPress={props.onPress}>
      <Text
        style={props.variant === 'secondary' ? styles.textSecondary : styles.textPrimary}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonPrimary: {
    width: '100%',
    backgroundColor: '#C6FF00',
    borderRadius: 5,
    paddingVertical: 12,
  },
  buttonSecondary: {
    width: '100%',
    backgroundColor: '#212121',
    borderRadius: 5,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textPrimary: {
    color: '#212121',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'semibold',
  },
  textSecondary: {
    color: '#C6FF00',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'semibold',
  },
});

export default CustomButton;
