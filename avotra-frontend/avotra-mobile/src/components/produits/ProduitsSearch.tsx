import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/styles.global";

interface Props {
    value: string;
    onChangeText: (value: string) => void;
    onClear: () => void;
}

export default function ProduitSearch({ value, onChangeText, onClear }: Props) {

    return (

        <View style={styles.containerSearch}>
            <Ionicons
                name="search-outline"
                size={21}
                color="#6B7280"
            />
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un produit..."
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
            />
            {value.length > 0 && (
                <Pressable onPress={onClear}  >
                    <Ionicons
                        name="close-circle"
                        size={21}
                        color="#6B7280"
                    />
                </Pressable>
            )}

        </View>
    );
}