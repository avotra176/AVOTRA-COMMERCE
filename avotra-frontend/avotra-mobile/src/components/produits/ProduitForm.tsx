import React from "react";
import {
    ActivityIndicator, Pressable, ScrollView, Text, TextInput, View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProduitFormData } from "../../types/produit.types";
import { useTheme } from "../../constants/theme.constants";

interface Categorie { id: number; nom: string; }

interface Props {
    form: ProduitFormData;
    setForm: React.Dispatch<React.SetStateAction<ProduitFormData>>;
    categories: Categorie[];
    loadingCategories?: boolean;
    saving: boolean;
    editing: boolean;
    onSave: () => void;
}

export default function ProduitForm({
    form,
    setForm,
    categories,
    loadingCategories = false,
    saving,
    editing,
    onSave
}: Props) {
    const { styles, colors } = useTheme();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* NOM */}
            <Text style={styles.label}> Nom du produit *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex : Riz"
                placeholderTextColor={colors.textLight}
                value={form.nom}
                onChangeText={value =>
                    setForm(previous => ({ ...previous, nom: value }))
                }
            />

            {/* CATÉGORIE */}
            <Text style={styles.label}>Catégorie *</Text>
            <View style={styles.categories}>
                {loadingCategories ? (
                    <View style={styles.loadingCategories}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={styles.loadingText}>Chargement des catégories...</Text>
                    </View>
                ) : categories.length === 0 ? (
                    <Text style={styles.emptyCategories}>Aucune catégorie disponible.</Text>
                ) : (
                    categories.map(categorie => {
                        const selected = form.categories_id === categorie.id;
                        return (
                            <Pressable
                                key={categorie.id}
                                onPress={() =>
                                    setForm(previous => ({ ...previous, categories_id: categorie.id }))
                                }
                                style={[styles.category, selected && styles.categorySelected]}
                            >
                                <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                                    {categorie.nom}
                                </Text>
                            </Pressable>
                        );
                    })
                )}
            </View>

            {/* DESCRIPTION */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Description..."
                placeholderTextColor={colors.textLight}
                value={form.description}
                onChangeText={value =>
                    setForm(previous => ({ ...previous, description: value }))
                }
                multiline
                textAlignVertical="top"
            />

            {/* PRIX ACHAT */}
            <Text style={styles.label}>Prix d'achat *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex : 12000"
                placeholderTextColor={colors.textLight}
                value={form.prix_achat?.toString() ?? ""}
                onChangeText={value =>
                    setForm(previous => ({ ...previous, prix_achat: Number(value) || 0 }))
                }
                keyboardType="numeric"
            />

            {/* PRIX VENTE */}
            <Text style={styles.label}>Prix de vente *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex : 15000"
                placeholderTextColor={colors.textLight}
                value={form.prix_vente?.toString() ?? ""}
                onChangeText={value =>
                    setForm(previous => ({ ...previous, prix_vente: Number(value) || 0 }))
                }
                keyboardType="numeric"
            />

            {/* UNITÉ */}
            <Text style={styles.label}>Unité *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex : kg, sac, pièce..."
                placeholderTextColor={colors.textLight}
                value={form.unite}
                onChangeText={value =>
                    setForm(previous => ({ ...previous, unite: value }))
                }
            />

            {/* ENREGISTRER */}
            <Pressable
                style={[styles.saveButton, saving && styles.disabled]}
                disabled={saving}
                onPress={onSave}
            >
                {saving ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <>
                        <Ionicons name="checkmark" size={22} color={colors.white} />
                        <Text style={styles.saveText}>
                            {editing ? "Modifier" : "Enregistrer"}
                        </Text>
                    </>
                )}
            </Pressable>
        </ScrollView>
    );
}