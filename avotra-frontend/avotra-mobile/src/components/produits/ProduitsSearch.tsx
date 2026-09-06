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
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 12, height: 44 }}>
            <Ionicons name="search-outline" size={19} color="rgba(255,255,255,0.7)" />
            <TextInput
                style={{ flex: 1, marginLeft: 8, color: colors.white, fontSize: 15 }}
                placeholder="Rechercher un produit..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={value}
                onChangeText={onChangeText}
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