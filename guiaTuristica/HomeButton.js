//HomeButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeButton = ({ userID }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.homeButton}
      onPress={() => navigation.navigate('Home', userID)}
    >
      <Ionicons name="home" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  homeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1D4576',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
});

export default HomeButton;
