//RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SUPABASE_URL = 'https://luzbiilujfqjznxncmpv.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1emJpaWx1amZxanpueG5jbXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjE2MTAsImV4cCI6MjA2MjEzNzYxMH0.SHErgEqdu8loNFBReY58FYL_-EM6iO810Gw00V0ORqI';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [cognoms, setCognoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_API_KEY,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al crear el compte');
      }

      const resposta = await fetch('http://192.168.68.120:3000/api/usuaris/crea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: nom,
          cognoms: cognoms,
          correu: email,
        }),
      });

      const dades = await resposta.json();

      console.log(dades);

      if (!resposta.ok) {
        throw new Error('Error al guardar les dades del perfil');
      }

      Alert.alert('Compte creat amb èxit!');
      navigation.navigate('LoginScreen');

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear compte</Text>
      <TextInput
        style={styles.input}
        placeholder="Correu Electrònic"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contrasenya"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Cognoms"
        value={cognoms}
        onChangeText={setCognoms}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? <Text style={styles.buttonText}>Carregant...</Text> : <Text style={styles.buttonText}>Crea</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.link}>Ja tens un compte? Inicia sessió</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDE4E8',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1D4576',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#1D4576',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 45,
    backgroundColor: '#1D4576',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  link: {
    marginTop: 10,
    color: '#1D4576',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
