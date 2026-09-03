import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/styles.global";
import { Produit } from "@/types/produit.types";

interface Props {
    visible: boolean;
    produits: Produit[];
    selectedId: number | null;
    onClose: () => void;
    onSelect: (produit: Produit) => void;
}

export default function ProduitPicker({
    visible,
    produits,
    selectedId,
    onClose,
    onSelect,
}: Props) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return produits;
        return produits.filter((p) =>
            p.nom.toLowerCase().includes(q)
        );
    }, [query, produits]);

    const resetAndClose = () => {
        setQuery("");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={resetAndClose}
        >
            <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <Text style={styles.modalTitle}>Produit</Text>
                    <Pressable onPress={resetAndClose} style={{ marginLeft: "auto" }}>
                        <Ionicons name="close" size={28} />
                    </Pressable>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        marginBottom: 12,
                    }}
                >
                    <Ionicons name="search" size={18} color="#888" />
                    <TextInput
                        style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8 }}
                        placeholder="Rechercher un produit..."
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                </View>

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => String(item.id)}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => {
                        const ruptureStock = item.stock <= 0;

                        return (
                            <Pressable
                                style={[
                                    styles.choice,
                                    selectedId === item.id && styles.choiceSelected,
                                    {
                                        marginBottom: 8,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        opacity: ruptureStock ? 0.5 : 1,
                                    },
                                ]}
                                onPress={() => {
                                    if (ruptureStock) return;
                                    onSelect(item);
                                    resetAndClose();
                                }}
                                disabled={ruptureStock}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={[
                                            styles.choiceText,
                                            selectedId === item.id && styles.choiceTextSelected,
                                        ]}
                                    >
                                        {item.nom}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                                        {item.prix_vente.toLocaleString("fr-FR")} Ar / {item.unite}
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: "600",
                                        color: ruptureStock ? "#DC2626" : "#16A34A",
                                    }}
                                >
                                    {ruptureStock
                                        ? "Rupture"
                                        : `Stock : ${item.stock}`}
                                </Text>
                            </Pressable>
                        );
                    }}
                    ListEmptyComponent={
                        <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
                            {query.trim()
                                ? "Aucun produit trouvé"
                                : "Aucun produit disponible"}
                        </Text>
                    }
                />
            </View>
        </Modal>
    );
}