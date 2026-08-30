import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../constants/auth.constants";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        AVOTRA COMMERCE
      </Text>

      <Text style={styles.welcome}>
        Bienvenue {user?.nom || user?.email}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Tableau de bord
        </Text>

        <Text style={styles.cardText}>
          Gestion de votre commerce
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
      //onPress={() => router.push("/produits")}
      >
        <Text style={styles.buttonText}>
          📦 Produits
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
      //onPress={() => router.push("/ventes")}
      >
        <Text style={styles.buttonText}>
          🛒 Ventes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
      //onPress={() => router.push("/achats")}
      >
        <Text style={styles.buttonText}>
          🧾 Achats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>
          Se déconnecter
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 60,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  welcome: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
  },

  button: {
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    marginBottom: 12,
  },

  logoutButton: {
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#777",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});