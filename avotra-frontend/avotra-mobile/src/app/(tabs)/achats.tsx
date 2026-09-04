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
import { createAchat, deleteAchat, getAchats, searchAchats, updateAchat, } from "../../services/achat.service";
import { Achat, CreateAchat, FormState, initialForm } from "../../types/achat.types";
import { useProduits } from "../../hooks/useProduits";
import { useFournisseurs } from "../../hooks/useFournisseurs";
import { useAuth } from "../../constants/auth.constants";
import { useTheme } from "../../constants/theme.constants";
import EmptyAchats from "@/components/achats/EmptyAchats";
import AchatCard from "@/components/achats/AchatCard";
import AchatFormModal from "@/components/achats/AchatFormModal";
import { colors } from '../../styles/styles.global';





export default function AchatsScreen() {
    const [achats, setAchats] = useState<Achat[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAchat, setEditingAchat] = useState<Achat | null>(null);
    const [form, setForm] = useState<FormState>(initialForm);
    const [saving, setSaving] = useState(false);
    const { produits } = useProduits();
    const { fournisseurs, addFournisseur } = useFournisseurs();
    const { user } = useAuth();

    // CHARGER LES ACHATS
    const loadAchats = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getAchats();

            setAchats(data);
        } catch (error: any) {
            console.log(
                "Erreur chargement achats:",
                error?.response?.data || error
            );

            Alert.alert(
                "Erreur",
                error?.response?.data?.message ||
                "Impossible de charger les achats."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadAchats(); }, [loadAchats]);

    // REFRESH
    const handleRefresh = async () => {
        try {
            setRefreshing(true);

            const data = search.trim()
                ? await searchAchats(search.trim())
                : await getAchats();

            setAchats(data);
        } catch (error: any) {
            console.log(
                "Erreur refresh:",
                error?.response?.data || error
            );
        } finally {
            setRefreshing(false);
        }
    };

    // RECHERCHE
    const handleSearch = async (value: string) => {
        setSearch(value);
        try {
            if (!value.trim()) {
                const data = await getAchats();
                setAchats(data);
                return;
            }

            const data = await searchAchats(value.trim());

            setAchats(data);
        } catch (error: any) {
            console.log(
                "Erreur recherche:",
                error?.response?.data || error
            );
        }
    };

    // OUVRIR AJOUT
    const openCreateModal = () => {
        setEditingAchat(null);
        setForm(initialForm);
        setModalVisible(true);
    };

    // OUVRIR MODIFICATION
    const openEditModal = (achat: Achat) => {
        setEditingAchat(achat);
        setForm({
            produit_id: achat.produit_id,
            fournisseur_id: achat.fournisseur_id,
            quantite: String(achat.quantite),
            prix_unitaire: String(achat.prix_unitaire),
        });

        setModalVisible(true);
    };

    // ENREGISTRER
    const handleSubmit = async () => {
        if (!form.produit_id) {
            Alert.alert("Erreur", "Veuillez sélectionner un produit.");
            return;
        }
        if (!form.fournisseur_id) {
            Alert.alert(
                "Erreur",
                "Veuillez sélectionner un fournisseur."
            );
            return;
        }

        const quantite = Number(form.quantite);
        const prix_unitaire = Number(form.prix_unitaire);

        if (!quantite || quantite <= 0) {
            Alert.alert(
                "Erreur",
                "La quantité doit être supérieure à 0."
            );
            return;
        }

        if (!prix_unitaire || prix_unitaire <= 0) {
            Alert.alert(
                "Erreur",
                "Le prix unitaire doit être supérieur à 0."
            );
            return;
        }

        if (!user?.id) {
            Alert.alert("Erreur", "Utilisateur non connecté.");
            return;
        }

        const data: CreateAchat = {
            utilisateur_id: user.id,
            fournisseur_id: form.fournisseur_id,
            produit_id: form.produit_id,
            quantite,
            prix_unitaire,
        };

        try {
            setSaving(true);

            if (editingAchat) {
                await updateAchat(
                    editingAchat.id,
                    data
                );

                Alert.alert("Succès", "Achat modifié avec succès.");
            } else {
                await createAchat(data);

                Alert.alert("Succès", "Achat enregistré avec succès.");
            }

            setModalVisible(false);
            setEditingAchat(null);
            setForm(initialForm);

            await loadAchats();
        } catch (error: any) {
            console.log("Erreur achat:", error?.response?.data || error);

            Alert.alert("Erreur", error?.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    };

    // SUPPRESSION
    const handleDelete = (achat: Achat) => {
        Alert.alert(
            "Supprimer l'achat",
            `Voulez-vous supprimer l'achat #${achat.id} ?`,
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAchat(achat.id);

                            Alert.alert(
                                "Succès",
                                "Achat supprimé avec succès."
                            );

                            await loadAchats();
                        } catch (error: any) {
                            console.log(
                                "Erreur suppression:",
                                error?.response?.data || error
                            );

                            Alert.alert(
                                "Erreur",
                                error?.response?.data?.message ||
                                "Impossible de supprimer l'achat."
                            );
                        }
                    },
                },
            ]
        );
    };

    // PRODUIT SÉLECTIONNÉ
    const selectedProduit = produits?.find(
        (produit: any) =>
            produit.id === form.produit_id
    );

    const selectedFournisseur =
        fournisseurs?.find(
            (fournisseur: any) =>
                fournisseur.id === form.fournisseur_id
        );

    const montantTotal =
        Number(form.quantite || 0) *
        Number(form.prix_unitaire || 0);

    // NOM PRODUIT
    const getProduitNom = (id: number) => {
        const produit = produits?.find(
            (item: any) => item.id === id
        );

        return produit?.nom || `Produit #${id}`;
    };

    // NOM FOURNISSEUR
    const getFournisseurNom = (id: number) => {
        const fournisseur = fournisseurs?.find((item: any) => item.id === id);
        return (fournisseur?.nom || `Fournisseur #${id}`);
    };
    const { styles, colors } = useTheme();


    // LOADING
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>
                        Chargement des achats...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ÉCRAN
    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.title}> Achats </Text>
                    <Text style={styles.subtitle}> Gestion des achats et du stock</Text>
                </View>
                <Pressable
                    style={styles.addButton}
                    onPress={openCreateModal}
                >
                    <Text style={styles.plus}>+</Text>
                    <Text style={styles.addText}> Ajouter</Text>
                </Pressable>
            </View>

            {/* RECHERCHE */}
            <View style={styles.containerSearch}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    color={colors.textSecondary}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un achat..."
                    value={search}
                    onChangeText={handleSearch}
                />
                {search.length > 0 && (
                    <Pressable
                        onPress={() =>
                            handleSearch("")
                        }
                    >
                        <Ionicons
                            name="close-circle"
                            size={22}
                            color={colors.textSecondary}
                        />
                    </Pressable>
                )}
            </View>

            {/* LISTE */}
            <FlatList
                data={achats}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <AchatCard
                        item={item}
                        getProduitNom={getProduitNom}
                        getFournisseurNom={getFournisseurNom}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                )}
                contentContainerStyle={
                    achats.length === 0
                        ? styles.emptyContainer
                        : styles.list
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                ListEmptyComponent={<EmptyAchats onAdd={openCreateModal} />}
            />

            {/* MODAL */}
            <AchatFormModal
                visible={modalVisible}
                editingAchat={editingAchat}
                form={form}
                produits={produits || []}
                fournisseurs={fournisseurs || []}
                montantTotal={montantTotal}
                saving={saving}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                setForm={setForm}
                onCreateFournisseur={addFournisseur}
            />

        </SafeAreaView>
    );
}

