import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import HomeButton from './HomeButton';

const BACKEND_URL = 'http://192.168.68.120:3000/api';

export default function SaveRouteScreen({ route, navigation }) {
  const places = route.params.places;
  const userID = route.params.userID;
  const [routeName, setRouteName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSave = async () => {
    if (!routeName.trim()) {
      Alert.alert('Falta el nom', 'Posa un nom per a la ruta.');
      return;
    }

    const incrementarFita = async (tipus) => {
      try {
        await fetch(`${BACKEND_URL}/fites/incrementar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idusuari: userID,
            tipus: tipus,
          }),
        });
      } catch (error) {
        console.warn(`No s'ha pogut incrementar la fita de tipus ${tipus}:`, error);
      }
    };

    try {
      const rutaRes = await fetch(`${BACKEND_URL}/rutes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: routeName,
          data: date.toISOString().split('T')[0],
        }),
      });

      if (!rutaRes.ok) throw new Error('Error en desar la ruta.');
      await incrementarFita('ruta');
      const novaRuta = await rutaRes.json();
      const rutaID = novaRuta.id;

      await fetch(`${BACKEND_URL}/rutes/usuaris`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idruta: rutaID,
          idusuari: userID,
        }),
      });

      if (rating > 0) {
        await incrementarFita('puntuacio');
        await fetch(`${BACKEND_URL}/rutes/puntuacions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            valor: rating,
            idruta: rutaID,
          }),
        });
      }

      if (comment.trim()) {
        await incrementarFita('comentari');
        await fetch(`${BACKEND_URL}/rutes/comentaris`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: comment,
            idruta: rutaID,
          }),
        });
      }

      for (let i = 0; i < places.length; i++) {
        const lloc = places[i];
        await fetch(`${BACKEND_URL}/rutes/llocs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idruta: rutaID,
            idlloc: lloc.id,
            ordre: i + 1,
          }),
        });
      }

      Alert.alert('Ruta desada!', 'La teva ruta s\'ha desat correctament.');
      navigation.navigate('Home', userID);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <Ionicons
          name={index < rating ? 'star' : 'star-outline'}
          size={30}
          color="#FFD700"
          style={{ marginHorizontal: 2 }}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <HomeButton userID={userID} />
      <Text style={styles.title}>Desar ruta</Text>

      <Text style={styles.label}>Nom de la ruta:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex. Ruta pel barri Gòtic"
        value={routeName}
        onChangeText={setRouteName}
      />

      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.label}>Puntuació:</Text>
      <View style={styles.starContainer}>{renderStars()}</View>

      <Text style={styles.label}>Comentari (opcional):</Text>
      <TextInput
        style={[styles.input, styles.commentBox]}
        placeholder="Comparteix la teva opinió sobre la ruta..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Desar ruta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4E8',
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D4576',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#1D4576',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  dateText: {
    fontSize: 16,
    color: '#1D4576',
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentBox: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1D4576',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
