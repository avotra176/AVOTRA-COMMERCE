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
import { styles } from "../../styles/styles.global";

// CATÉGORIE

interface Categorie {
    id: number;
    nom: string;
}


// ÉCRAN

export default function ProduitsScreen() {
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

    // CATÉGORIES

    const { categories, loading: loadingCategories, fetchCategories } = useCategories();
    // MODAL
    const [modalVisible, setModalVisible] = useState(false);

    // FORMULAIRE
    const [form, setForm] = useState<ProduitFormData>(initialForm);

    // MODIFICATION // SAUVEGARDE  // OUVRIR AJOUT
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

    // OUVRIR MODIFICATION

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


    // FERMER
    const closeModal = () => {
        if (saving) { return; }
        setModalVisible(false);
        setEditingId(null);
        setForm(initialForm);
    };

    // VALIDATION

    const validate = (): boolean => {
        if (!form.categories_id) {
            Alert.alert(
                "Attention",
                "Sélectionnez une catégorie."
            );
            return false;
        }

        if (!form.nom.trim()) {
            Alert.alert(
                "Attention",
                "Le nom du produit est obligatoire."
            );
            return false;
        }
        const prixAchat = Number(form.prix_achat);
        const prixVente = Number(form.prix_vente);

        if (
            !Number.isFinite(prixAchat) || prixAchat < 0
        ) {
            Alert.alert(
                "Attention",
                "Prix d'achat invalide."
            );
            return false;
        }

        if (
            !Number.isFinite(prixVente) || prixVente < 0
        ) {
            Alert.alert(
                "Attention",
                "Prix de vente invalide."
            );
            return false;
        }

        if (!form.unite.trim()) {
            Alert.alert(
                "Attention",
                "L'unité est obligatoire."
            );
            return false;
        }
        return true;
    };

    // SAUVEGARDER  

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
                Alert.alert(
                    "Succès",
                    "Produit enregistré avec succès."
                );

            } else {
                await updateProduit(
                    editingId,
                    data
                );
                Alert.alert(
                    "Succès",
                    "Produit modifié avec succès."
                );
            }
            closeModal();

        } catch (error: any) {
            Alert.alert(
                "Erreur",
                error?.response?.data?.message ??
                error?.message ??
                "Une erreur est survenue."
            );

        } finally {
            setSaving(false);
        }
    };

    // SUPPRIMER
    const handleDelete = (
        produit: Produit
    ) => {
        Alert.alert(
            "Supprimer",
            `Voulez-vous supprimer "${produit.nom}" ?`,
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProduit(produit.id);
                            Alert.alert("Succès", "Produit supprimé.");

                        } catch (
                        error: any
                        ) {
                            Alert.alert(
                                "Erreur",
                                error?.response
                                    ?.data
                                    ?.message ??
                                error?.message ??
                                "Impossible de supprimer."
                            );
                        }
                    }
                }
            ]
        );
    };

    // RENDU

    if (loading) {
        return (
            <SafeAreaView style={styles.loading} >
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                    Chargement des produits...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Produits</Text>
                    <Text style={styles.subtitle}>Liste des produits</Text>
                </View>
                <Pressable
                    style={[styles.addButton, loadingCategories && styles.addButtonDisabled]}
                    onPress={openCreate}
                    disabled={loadingCategories}
                >
                    {loadingCategories ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Ionicons name="add" size={20} color="#FFFFFF" />
                    )}
                    <Text style={styles.addText}>{loadingCategories ? "Chargement..." : "Ajouter"}</Text>
                </Pressable>
            </View>
            <ProduitSearch value={search} onChangeText={searchProduits} onClear={() => searchProduits("")} />
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
                            <Text style={styles.modalTitle}>{editingId === null ? "Créer produit" : "Modifier produit"}</Text>
                            <Pressable onPress={closeModal}>
                                <Ionicons name="close" size={22} color="#111827" />
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
