import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/styles.global";

interface Props {
    onAdd: () => void;
}

export default function EmptyAchats({ onAdd }: Props) {
    return (
        <View style={styles.empty}>
            <Ionicons name="cart-outline" size={60} />

            <Text style={styles.emptyTitle}>
                Aucun achat
            </Text>

            <Text style={styles.emptyText}>
                Aucun achat ne correspond à votre recherche.
            </Text>

            <Pressable
                style={styles.emptyButton}
                onPress={onAdd}
            >
                <Ionicons name="add" size={20} color="#fff" />

                <Text style={styles.emptyButtonText}>
                    Ajouter un achat
                </Text>
            </Pressable>
        </View>
    );
}
