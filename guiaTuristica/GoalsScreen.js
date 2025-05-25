import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeButton from './HomeButton';
import { useRoute } from '@react-navigation/native';

const BACKEND_URL = 'http://192.168.68.120:3000/api/fites';

export default function FitesScreen() {
  const route = useRoute();
  const userID = route.params;

  const [fites, setFites] = useState({
    nRutes: 0,
    nComentaris: 0,
    nValoracions: 0,
  });

  useEffect(() => {
    if (!userID) return;

    const fetchFites = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/usuari/${userID}`);
        if (!res.ok) throw new Error('No s\'han pogut obtenir les fites');
        const data = await res.json();
        setFites({
          nRutes: data.nrutes || 0,
          nComentaris: data.ncomentaris || 0,
          nValoracions: data.nvaloracions || 0,
        });
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchFites();
  }, [userID]);

  const categories = [
    {
      title: 'Rutes completades',
      progress: fites.nRutes,
      icon: 'map',
      levels: [
        { threshold: 5, label: 'Principiant' },
        { threshold: 25, label: 'Intermedi' },
        { threshold: 100, label: 'Expert' },
      ],
      color: '#1D4576',
    },
    {
      title: 'Valoracions fetes',
      progress: fites.nValoracions,
      icon: 'star',
      levels: [
        { threshold: 5, label: 'Principiant' },
        { threshold: 25, label: 'Intermedi' },
        { threshold: 100, label: 'Expert' },
      ],
      color: '#FFD700',
    },
    {
      title: 'Comentaris fets',
      progress: fites.nComentaris,
      icon: 'comment',
      levels: [
        { threshold: 5, label: 'Principiant' },
        { threshold: 25, label: 'Intermedi' },
        { threshold: 100, label: 'Expert' },
      ],
      color: '#FF6347',
    },
  ];

  const renderBadge = (icon, color, achieved) => (
    <Icon
      name={icon}
      size={30}
      color={color}
      style={{ opacity: achieved ? 1 : 0.3 }}
    />
  );

  return (
    <View style={styles.container}>
      <HomeButton userID= {userID} />
      <Text style={styles.title}>Les meves fites</Text>

      {categories.map((category, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          {category.levels.map((level, i) => (
            <View key={i} style={styles.row}>
              {renderBadge(category.icon, category.color, category.progress >= level.threshold)}
              <Text style={styles.text}>
                {level.threshold} - {level.label}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60,
    backgroundColor: '#DDE4E8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D4576',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1D4576',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    color: '#1D4576',
  },
});