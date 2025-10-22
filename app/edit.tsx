import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
}

export default function AddDishScreen() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Starter");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const addDish = async () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const newDish: Dish = {
      id: Date.now().toString(),
      name,
      category,
      description,
      price,
    };

    try {
      const existing = await AsyncStorage.getItem("dishes");
      const dishes = existing ? JSON.parse(existing) : [];
      const updated = [...dishes, newDish];
      await AsyncStorage.setItem("dishes", JSON.stringify(updated));

      Alert.alert("Success", "Dish added!");
      setName("");
      setDescription("");
      setCategory("Starter");
      setPrice("");
    } catch (error) {
      Alert.alert("Error", "Failed to save dish.");
    }
  };

  const clearAllDishes = async () => {
    Alert.alert(
      "Confirm Clear",
      "Are you sure you want to delete all meals?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("dishes");
              Alert.alert("Cleared", "All dishes have been removed.");
              setName("");
              setDescription("");
              setCategory("Starter");
              setPrice("");
            } catch (error) {
              Alert.alert("Error", "Failed to clear dishes.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, {textAlign: "center"}]}>Dish Entry</Text>

      <TextInput
        style={styles.input}
        placeholder="Meal Name"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(value: string) => setCategory(value)}
          style={styles.picker}
        >
          <Picker.Item label="Starter" value="Starter" />
          <Picker.Item label="Main Course" value="Main Course" />
          <Picker.Item label="Dessert" value="Dessert" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Meal Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={addDish}>
        <Text style={styles.buttonText}>Add Dish</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAllDishes}>
        <Text style={styles.clearButtonText}>Clear All Meals</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: { height: 50, width: "100%" },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  clearButton: {
    backgroundColor: "#ff4d4d",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
