import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme.constants";

export default function ProduitEmpty() {
    const { styles, colors } = useTheme();

    return (
        <View style={styles.empty}>
            <Ionicons
                name="cube-outline"
                size={60}
                color={colors.textLight}
            />
            <Text style={styles.emptyTitle}>Aucun produit</Text>
            <Text style={styles.emptyText}>
                Aucun produit ne correspond à votre recherche.
            </Text>
        </View>
    );
}