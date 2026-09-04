import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Achat } from "../../types/achat.types";
import { useTheme } from "../../constants/theme.constants";

interface Props {
    item: Achat;
    getProduitNom: (id: number) => string;
    getFournisseurNom: (id: number) => string;
    onEdit: (achat: Achat) => void;
    onDelete: (achat: Achat) => void;
}

export default function AchatCard({

    item,
    getProduitNom,
    getFournisseurNom,
    onEdit,
    onDelete,
}: Props) {
    const { styles, colors } = useTheme();
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.achatTitle}>
                        {getProduitNom(item.produit_id)}
                    </Text>
                    <Text style={styles.achatId}>
                        Achat #{item.id}
                    </Text>
                </View>

                <Text style={styles.total}>
                    {Number(item.montant_total).toLocaleString("fr-FR")} Ar
                </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <Ionicons name="business-outline" color={colors.primary} size={18} />
                    <Text style={styles.infoText}>
                        {getFournisseurNom(item.fournisseur_id)}
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="cube-outline" color={colors.primary} size={18} />

                    <Text style={styles.infoText}>
                        {item.quantite} unité(s)
                    </Text>
                </View>
            </View>

            <View style={styles.header}>
                <Text style={styles.price}>
                    Prix unitaire :{" "}
                    {Number(item.prix_unitaire).toLocaleString("fr-FR")} Ar
                </Text>

                <View style={styles.actions}>
                    <Pressable
                        style={styles.action}
                        onPress={() => onEdit(item)}
                    >
                        <Ionicons name="create-outline" size={20} color={colors.primary} />

                        {/* <Text style={styles.buttonText}>
                            Modifier
                        </Text> */}
                    </Pressable>
                    <Pressable
                        style={styles.action}
                        onPress={() => onDelete(item)}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                        {/* <Text style={styles.deleteText}>
                            Supprimer
                        </Text> */}
                    </Pressable>
                </View>
            </View>


        </View>
    );
}
