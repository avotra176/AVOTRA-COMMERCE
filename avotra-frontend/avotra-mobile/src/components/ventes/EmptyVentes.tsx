import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/styles.global";

interface Props {
    onAdd: () => void;
}

export default function EmptyVentes({ onAdd }: Props) {
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