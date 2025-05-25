//LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SUPABASE_URL = 'https://luzbiilujfqjznxncmpv.supabase.co'; 
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1emJpaWx1amZxanpueG5jbXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjE2MTAsImV4cCI6MjA2MjEzNzYxMH0.SHErgEqdu8loNFBReY58FYL_-EM6iO810Gw00V0ORqI';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
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

      const getIdRes = await fetch(`http://192.168.68.120:3000/api/usuaris/${email}`);

      if (!getIdRes.ok) {
        throw new Error("No s'ha pogut obtenir l'ID de l'usuari");
      }

      const { id: userID } = await getIdRes.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al iniciar sessió');
      }

      Alert.alert('Benvingut!', `Sessió iniciada amb èxit com ${data.user.email}`);
      navigation.navigate('Home', userID);

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sessió</Text>

      <TextInput
        style={styles.input}
        placeholder="Correu Electrònic"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contrasenya"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <Text style={styles.buttonText}>Cargando...</Text> : <Text style={styles.buttonText}>Inicia</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.link}>No tens compte? Registrat</Text>
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

export default LoginScreen;