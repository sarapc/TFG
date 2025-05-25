import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeButton from './HomeButton';

const RouteOrderScreen = ({ route, navigation }) => {
  const places = route.params.places
  const userID = route.params.userID;

  const [data, setData] = useState(places);

  const moveItem = (index, direction) => {
    const newData = [...data];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= data.length) return;

    const temp = newData[index];
    newData[index] = newData[targetIndex];
    newData[targetIndex] = temp;

    setData(newData);
  };

  const handleSaveOrder = () => {
    navigation.navigate('MapScreen', { places: data, userID });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.nom}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => moveItem(index, 'up')}>
          <Ionicons name="arrow-up-circle-outline" size={24} color="#1D4576" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => moveItem(index, 'down')}>
          <Ionicons name="arrow-down-circle-outline" size={24} color="#1D4576" style={{ marginTop: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <HomeButton userID= {userID} />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Ordena els llocs seleccionats</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveOrder}>
        <Text style={styles.saveButtonText}>Desa ordre</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#DDE4E8',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: -20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#61A4DE',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#1D4576',
    flex: 1,
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 100,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RouteOrderScreen;
