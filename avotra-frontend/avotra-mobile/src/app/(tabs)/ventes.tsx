import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVentes } from "../../hooks/useVentes";
import { useProduits } from "../../hooks/useProduits";
import { useAuth } from "../../constants/auth.constants";
import { Vente, CreateVente, FormState, initialForm } from "../../types/vente.types";
import { useTheme } from "../../constants/theme.constants";
import EmptyVentes from "@/components/ventes/EmptyVentes";
import VenteCard from "@/components/ventes/VenteCard";
import VenteFormModal from "@/components/ventes/VenteFormModal";
import AppHeader from "@/components/ui/AppHeader";

export default function VentesScreen() {
    const { ventes, loading, fetchVentes, addVente, editVente, removeVente } = useVentes();
    const { produits } = useProduits();
    const { user } = useAuth();

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVente, setEditingVente] = useState<Vente | null>(null);
    const [form, setForm] = useState<FormState>(initialForm);
    const [saving, setSaving] = useState(false);

    const { styles, colors } = useTheme();

    // REFRESH
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchVentes();
        } finally {
            setRefreshing(false);
        }
    };

    // RECHERCHE (filtrage frontend)
    const filteredVentes = ventes.filter((vente) => {
        if (!search.trim()) return true;
        const produit = produits?.find((p: any) => p.id === vente.produit_id);
        const nomProduit = produit?.nom?.toLowerCase() || "";
        return (
            nomProduit.includes(search.trim().toLowerCase()) ||
            String(vente.id).includes(search.trim())
        );
    });

    // OUVRIR AJOUT
    const openCreateModal = () => {
        setEditingVente(null);
        setForm(initialForm);
        setModalVisible(true);
    };

    // OUVRIR MODIFICATION
    const openEditModal = (vente: Vente) => {
        setEditingVente(vente);
        setForm({
            produit_id: vente.produit_id,
            quantite: String(vente.quantite),
            prix_unitaire: String(vente.prix_unitaire),
        });
        setModalVisible(true);
    };

    // ENREGISTRER
    const handleSubmit = async () => {
        if (!form.produit_id) {
            Alert.alert("Erreur", "Veuillez sélectionner un produit.");
            return;
        }

        const quantite = Number(form.quantite);
        const prix_unitaire = Number(form.prix_unitaire);

        if (!quantite || quantite <= 0) {
            Alert.alert("Erreur", "La quantité doit être supérieure à 0.");
            return;
        }

        if (!prix_unitaire || prix_unitaire <= 0) {
            Alert.alert("Erreur", "Le prix unitaire doit être supérieur à 0.");
            return;
        }

        if (!user?.id) {
            Alert.alert("Erreur", "Utilisateur non connecté.");
            return;
        }

        const data: CreateVente = {
            utilisateur_id: user.id,
            produit_id: form.produit_id,
            quantite,
            prix_unitaire,
            montant_total: quantite * prix_unitaire,
        };

        try {
            setSaving(true);

            if (editingVente) {
                await editVente(editingVente.id, data);
                Alert.alert("Succès", "Vente modifiée avec succès.");
            } else {
                await addVente(data);
                Alert.alert("Succès", "Vente enregistrée avec succès.");
            }

            setModalVisible(false);
            setEditingVente(null);
            setForm(initialForm);
        } catch (error: any) {
            console.log("Erreur vente:", error?.response?.data || error);
            Alert.alert("Erreur", error?.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    };

    // SUPPRESSION
    const handleDelete = (vente: Vente) => {
        Alert.alert(
            "Supprimer la vente",
            `Voulez-vous supprimer la vente #${vente.id} ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeVente(vente.id);
                            Alert.alert("Succès", "Vente supprimée avec succès.");
                        } catch (error: any) {
                            Alert.alert(
                                "Erreur",
                                error?.response?.data?.message || "Impossible de supprimer la vente."
                            );
                        }
                    },
                },
            ]
        );
    };

    const montantTotal = Number(form.quantite || 0) * Number(form.prix_unitaire || 0);

    const getProduitNom = (id: number) => {
        const produit = produits?.find((item: any) => item.id === id);
        return produit?.nom || `Produit #${id}`;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>Chargement des ventes...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Ventes" subtitle="Gestion des ventes et du stock" rightIcon="add-circle" onRightPress={openCreateModal}  >
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 12, height: 44 }}>
                    <Ionicons name="search-outline" size={19} color="rgba(255,255,255,0.7)" />
                    <TextInput
                        style={{ flex: 1, marginLeft: 8, color: colors.white, fontSize: 15 }}
                        placeholder="Rechercher une vente..."
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <Pressable onPress={() => setSearch("")}>
                            <Ionicons name="close-circle" size={22} color="#777" />
                        </Pressable>
                    )}
                </View>
            </AppHeader>

            <FlatList
                data={filteredVentes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <VenteCard
                        item={item}
                        getProduitNom={getProduitNom}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                )}
                contentContainerStyle={
                    filteredVentes.length === 0 ? styles.emptyContainer : styles.list
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={<EmptyVentes onAdd={openCreateModal} />}
            />

            <VenteFormModal
                visible={modalVisible}
                editingVente={editingVente}
                form={form}
                produits={produits || []}
                montantTotal={montantTotal}
                saving={saving}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                setForm={setForm}
            />
        </SafeAreaView>
    );
}