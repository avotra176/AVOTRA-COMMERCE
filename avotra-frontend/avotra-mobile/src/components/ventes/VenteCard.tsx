import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Vente } from "../../types/vente.types";
import { styles } from "../../styles/styles.global";

interface Props {
    item: Vente;
    getProduitNom: (id: number) => string;
    onEdit: (vente: Vente) => void;
    onDelete: (vente: Vente) => void;
}

export default function VenteCard({ item, getProduitNom, onEdit, onDelete }: Props) {
    const formatPrice = (value: number) => `${Number(value).toLocaleString("fr-FR")} Ar`;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="cash-outline" size={26} color="#16A34A" />
                </View>

                <View style={styles.info}>
                    <Text style={styles.name}>{getProduitNom(item.produit_id)}</Text>
                    <Text style={styles.unit}>
                        {item.quantite} x {formatPrice(item.prix_unitaire)}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Pressable onPress={() => onEdit(item)} style={styles.action}>
                        <Ionicons name="create-outline" size={21} color="#2563EB" />
                    </Pressable>
                    <Pressable onPress={() => onDelete(item)} style={styles.action}>
                        <Ionicons name="trash-outline" size={21} color="#DC2626" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.details}>
                <View>
                    <Text style={styles.label}>Montant total</Text>
                    <Text style={styles.value}>{formatPrice(item.montant_total)}</Text>
                </View>

                <View>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>
                        {new Date(item.date_vente).toLocaleDateString("fr-FR")}
                    </Text>
                </View>
            </View>
        </View>
    );
}