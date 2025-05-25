import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import HomeButton from './HomeButton';


const BACKEND_URL = 'http://192.168.68.120:3000/api/usuaris';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const userID = route.params;

  const [editingField, setEditingField] = useState(null);
  const [profile, setProfile] = useState({
    nom: '',
    cognoms: '',
    correu: '',
  });

  useEffect(() => {
    if (!userID) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/id/${userID}`);
        if (!res.ok) throw new Error('No s\'han pogut obtenir les dades');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    };
    fetchProfile();
  }, [userID]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const saveProfileChanges = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/act/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Error update:', errorData);
        throw new Error(errorData.error || 'Error en desar les dades');
      }

      const updatedUser = await res.json();

      Alert.alert('Perfil desat', 'Les dades s\'han actualitzat correctament');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderField = (label, fieldKey) => {
    const isEditable = fieldKey !== 'correu';
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputRow}>
          {editingField === fieldKey && isEditable ? (
            <TextInput
              style={styles.input}
              value={profile[fieldKey] || ''}
              onChangeText={(value) => handleChange(fieldKey, value)}
              autoFocus
            />
          ) : (
            <Text style={styles.value}>{profile[fieldKey]}</Text>
          )}
          {isEditable && (
          <TouchableOpacity onPress={() => setEditingField(fieldKey)}>
            <Ionicons name="pencil" size={20} color="#1D4576" />
          </TouchableOpacity>
        )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HomeButton userID= {userID} />
      <Text style={styles.title}>El meu perfil</Text>

      {renderField('Nom', 'nom')}
      {renderField('Cognoms', 'cognoms')}
      {renderField('Correu electrònic', 'correu')}

      <TouchableOpacity style={styles.saveButton} onPress={saveProfileChanges}>
        <Text style={styles.saveButtonText}>Desar els canvis</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.goalsButton}
        onPress={() => navigation.navigate('GoalsScreen', userID)}
      >
        <Text style={styles.goalsButtonText}>Veure les meves fites</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4E8',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D4576',
    marginBottom: 30,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#1D4576',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#1D4576',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1D4576',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#1D4576',
  },
  saveButton: {
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  goalsButton: {
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  goalsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
