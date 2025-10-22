import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
}

export default function MenuScreen() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filter, setFilter] = useState<"All" | "Starter" | "Main Course" | "Dessert">("All");

  useFocusEffect(
    useCallback(() => {
      const loadDishes = async () => {
        try {
          const data = await AsyncStorage.getItem("dishes");
          setDishes(data ? JSON.parse(data) : []);
        } catch (error) {
          console.log("Error loading dishes:", error);
        }
      };
      loadDishes();
    }, [])
  );

  const filteredDishes =
    filter === "All" ? dishes : dishes.filter((dish) => dish.category === filter);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {textAlign: "center"}]}>Chef Christoffel’s Menu</Text>
      <Text style={styles.count}>Total Dishes: {filteredDishes.length}</Text>


      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filter}
          onValueChange={(value: "All" | "Starter" | "Main Course" | "Dessert") => setFilter(value)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Starter" value="Starter" />
          <Picker.Item label="Main Course" value="Main Course" />
          <Picker.Item label="Dessert" value="Dessert" />
        </Picker>
      </View>

      {filteredDishes.length === 0 ? (
        <Text style={styles.empty}>No meals available.</Text>
      ) : (
        <FlatList
          data={filteredDishes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>R{item.price}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: { height: 50, width: "100%" },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
count: {
  fontSize: 16,
  color: "#555",
  marginBottom: 10,
},
  name: { fontSize: 18, fontWeight: "bold" },
  category: { fontStyle: "italic", color: "#555" },
  description: { marginTop: 5 },
  price: { color: "#28a745", fontWeight: "600", marginTop: 5 },
  empty: { textAlign: "center", color: "#777", marginTop: 20 },
});