import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from '../../styles/styles.global';

export default function ProduitEmpty() {
    return (
        <View style={styles.container}>
            <Ionicons
                name="cube-outline"
                size={60}
                color="#9CA3AF"
            />
            <Text style={styles.title}>  Aucun produit </Text>
            <Text style={styles.text}>
                Aucun produit ne correspond à votre recherche.
            </Text>

        </View>
    );
}


