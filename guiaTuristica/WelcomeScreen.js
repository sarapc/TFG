//WelcomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>GoRuta</Text>
      <Text style={styles.tagline}>Descobreix. Planifica. Explora.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.buttonText}>Inicia sessió</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Crea compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1D4576',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#1D4576',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#1D4576',
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1D4576',
  },
  secondaryButtonText: {
    color: '#1D4576',
  },
});
