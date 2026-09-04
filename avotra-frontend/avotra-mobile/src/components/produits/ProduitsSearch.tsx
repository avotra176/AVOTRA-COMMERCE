import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme.constants";

interface Props {
    value: string;
    onChangeText: (value: string) => void;
    onClear: () => void;
}

export default function ProduitSearch({ value, onChangeText, onClear }: Props) {
    const { styles, colors } = useTheme();

    return (
        <View style={styles.containerSearch}>
            <Ionicons
                name="search-outline"
                size={21}
                color={colors.textLight}
            />
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un produit..."
                placeholderTextColor={colors.textLight}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
            />
            {value.length > 0 && (
                <Pressable onPress={onClear}>
                    <Ionicons
                        name="close-circle"
                        size={21}
                        color={colors.textLight}
                    />
                </Pressable>
            )}
        </View>
    );
}