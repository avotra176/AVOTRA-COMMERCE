import React, { useState } from "react";
import {
    ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable,
    RefreshControl, Text, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProduitCard from "../../components/produits/ProduitCard";
import ProduitSearch from "../../components/produits/ProduitsSearch";
import ProduitEmpty from "../../components/produits/ProduitEmpty";
import ProduitForm from "../../components/produits/ProduitForm";
import { useProduits } from "../../hooks/useProduits";
import { Produit, ProduitFormData, initialForm } from "../../types/produit.types";
import { useCategories } from "@/hooks/useCategories";
import { useTheme } from "../../constants/theme.constants";
import AppHeader from "@/components/ui/AppHeader";

interface Categorie {
    id: number;
    nom: string;
}

export default function ProduitsScreen() {
    const { styles, colors } = useTheme();
    const {
        produits,
        loading,
        refreshing,
        search,
        refresh,
        searchProduits,
        createProduit,
        updateProduit,
        deleteProduit
    } = useProduits();

    const { categories, loading: loadingCategories, fetchCategories } = useCategories();
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState<ProduitFormData>(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const openCreate = async () => {
        if (categories.length === 0 && !loadingCategories) {
            await fetchCategories();
        }
        setEditingId(null);
        setForm(initialForm);
        setModalVisible(true);
    };

    const openEdit = (produit: Produit) => {
        setEditingId(produit.id);
        setForm({
            categories_id: produit.categories_id,
            nom: produit.nom,
            description: produit.description ?? "",
            prix_achat: produit.prix_achat,
            prix_vente: produit.prix_vente,
            unite: produit.unite
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        if (saving) { return; }
        setModalVisible(false);
        setEditingId(null);
        setForm(initialForm);
    };

    const validate = (): boolean => {
        if (!form.categories_id) {
            Alert.alert("Attention", "Sélectionnez une catégorie.");
            return false;
        }
        if (!form.nom.trim()) {
            Alert.alert("Attention", "Le nom du produit est obligatoire.");
            return false;
        }
        const prixAchat = Number(form.prix_achat);
        const prixVente = Number(form.prix_vente);
        if (!Number.isFinite(prixAchat) || prixAchat < 0) {
            Alert.alert("Attention", "Prix d'achat invalide.");
            return false;
        }
        if (!Number.isFinite(prixVente) || prixVente < 0) {
            Alert.alert("Attention", "Prix de vente invalide.");
            return false;
        }
        if (!form.unite.trim()) {
            Alert.alert("Attention", "L'unité est obligatoire.");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validate()) { return; }
        try {
            setSaving(true);
            const data = {
                categories_id: Number(form.categories_id),
                nom: form.nom.trim(),
                description: form.description?.trim() || undefined,
                prix_achat: Number(form.prix_achat),
                prix_vente: Number(form.prix_vente),
                unite: form.unite.trim()
            };

            if (editingId === null) {
                await createProduit(data);
                Alert.alert("Succès", "Produit enregistré avec succès.");
            } else {
                await updateProduit(editingId, data);
                Alert.alert("Succès", "Produit modifié avec succès.");
            }
            closeModal();
        } catch (error: any) {
            Alert.alert(
                "Erreur",
                error?.response?.data?.message ?? error?.message ?? "Une erreur est survenue."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (produit: Produit) => {
        Alert.alert(
            "Supprimer",
            `Voulez-vous supprimer "${produit.nom}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProduit(produit.id);
                            Alert.alert("Succès", "Produit supprimé.");
                        } catch (error: any) {
                            Alert.alert(
                                "Erreur",
                                error?.response?.data?.message ?? error?.message ?? "Impossible de supprimer."
                            );
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Chargement des produits...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Produits" subtitle="Gestion des produits" rightIcon="add-circle"
                onRightPress={openCreate}>
                <ProduitSearch value={search} onChangeText={searchProduits} onClear={() => searchProduits("")} />

            </AppHeader>

            <FlatList
                data={produits}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <ProduitCard produit={item} onEdit={openEdit} onDelete={handleDelete} />
                )}
                contentContainerStyle={produits.length === 0 ? styles.empty : styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
                ListEmptyComponent={<ProduitEmpty />}
            />

            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.overlay}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingId === null ? "Créer produit" : "Modifier produit"}
                            </Text>
                            <Pressable onPress={closeModal}>
                                <Ionicons name="close" size={22} color={colors.text} />
                            </Pressable>
                        </View>

                        <ProduitForm
                            form={form}
                            setForm={setForm}
                            categories={categories}
                            loadingCategories={loadingCategories}
                            saving={saving}
                            editing={editingId !== null}
                            onSave={handleSave}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}