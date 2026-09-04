import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme.constants";

interface Props {
    onAdd: () => void;
}

export default function EmptyVentes({ onAdd }: Props) {
    const { styles, colors } = useTheme();
    return (
        <View style={styles.empty}>
            <Ionicons name="cash-outline" size={60} />

            <Text style={styles.emptyTitle}>
                Aucune vente
            </Text>

            <Text style={styles.emptyText}>
                Aucune vente ne correspond à votre recherche.
            </Text>

            <Pressable
                style={styles.emptyButton}
                onPress={onAdd}
            >
                <Ionicons name="add" size={20} color="#fff" />

                <Text style={styles.emptyButtonText}>
                    Ajouter une vente
                </Text>
            </Pressable>
        </View>
    );
}