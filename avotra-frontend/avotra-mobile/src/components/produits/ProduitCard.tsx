import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Produit } from "../../types/produit.types";
import { styles } from '../../styles/styles.global';

interface Props {
    produit: Produit;
    onEdit: (produit: Produit) => void;
    onDelete: (produit: Produit) => void;
}

export default function ProduitCard({ produit, onEdit, onDelete }: Props) {

    const formatPrice = (value: number) => {
        return `${Number(value).toLocaleString(
            "fr-FR"
        )} Ar`;
    };
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="cube-outline"
                        size={26}
                        color="#2563EB" />
                </View>

                <View style={styles.info}>
                    <Text style={styles.name}>  {produit.nom}  </Text>
                    <Text style={styles.unit}>Unité : {produit.unite}</Text>
                </View>

                // action ajouter et modification
                <View style={styles.actions}>
                    <Pressable
                        onPress={() => onEdit(produit)}
                        style={styles.action}
                    >
                        <Ionicons
                            name="create-outline"
                            size={21}
                            color="#2563EB"
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => onDelete(produit)}
                        style={styles.action}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={21}
                            color="#DC2626"
                        />
                    </Pressable>
                </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.details}>
                <View>
                    <Text style={styles.label}> Prix achat  </Text>
                    <Text style={styles.value}>{formatPrice(produit.prix_achat)} </Text>
                </View>

                <View>
                    <Text style={styles.label}> Prix vente </Text>
                    <Text style={styles.value}> {formatPrice(produit.prix_vente)}</Text>
                </View>

                <View>
                    <Text style={styles.label}>
                        Stock
                    </Text>

                    <Text
                        style={[
                            styles.value,
                            produit.stock <= 0 &&
                            styles.stockZero
                        ]}
                    >
                        {produit.stock}
                    </Text>

                </View>

            </View>

        </View>
    );
}

