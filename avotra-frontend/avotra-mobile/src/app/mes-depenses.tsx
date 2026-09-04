import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAchats } from "../services/achat.service";
import { useVentes } from "../hooks/useVentes";
import { useProduits } from "../hooks/useProduits";
import { useDepenses } from "../hooks/useDepenses";
import { useAuth } from "../constants/auth.constants";
import { Achat } from "../types/achat.types";
import {
    DepensePersonnelle,
    DepenseFormState,
    initialDepenseForm,
} from "../types/depense.types";
import { useTheme } from "../constants/theme.constants";
import DepenseFormModal from "@/components/depenses/DepenseFormModal";

type Univers = "pro" | "perso";
type OngletPro = "achats" | "ventes";

export default function MesDepensesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { produits } = useProduits();
    const { ventes, loading: loadingVentes, fetchVentes } = useVentes();
    const {
        depenses,
        loading: loadingDepenses,
        fetchDepenses,
        addDepense,
        editDepense,
        removeDepense,
    } = useDepenses(user?.id);

    const [achats, setAchats] = useState<Achat[]>([]);
    const [loadingAchats, setLoadingAchats] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [univers, setUnivers] = useState<Univers>("pro");
    const [ongletPro, setOngletPro] = useState<OngletPro>("achats");

    const [modalVisible, setModalVisible] = useState(false);
    const [editingDepense, setEditingDepense] = useState<DepensePersonnelle | null>(null);
    const [form, setForm] = useState<DepenseFormState>(initialDepenseForm);
    const [saving, setSaving] = useState(false);

    const loadAchats = async () => {
        try {
            setLoadingAchats(true);
            const data = await getAchats();
            setAchats(data);
        } catch (error) {
            console.log("Erreur chargement achats:", error);
        } finally {
            setLoadingAchats(false);
        }
    };

    useEffect(() => {
        loadAchats();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([loadAchats(), fetchVentes(), fetchDepenses()]);
        setRefreshing(false);
    };

    // FILTRAGE PRO SUR L'UTILISATEUR CONNECTÉ
    const mesAchats = useMemo(
        () => achats.filter((a) => a.utilisateur_id === user?.id),
        [achats, user?.id]
    );
    const mesVentes = useMemo(
        () => ventes.filter((v) => v.utilisateur_id === user?.id),
        [ventes, user?.id]
    );

    const totalAchats = useMemo(
        () => mesAchats.reduce((t, a) => t + Number(a.montant_total), 0),
        [mesAchats]
    );
    const totalVentes = useMemo(
        () => mesVentes.reduce((t, v) => t + Number(v.montant_total), 0),
        [mesVentes]
    );
    const totalDepensesPerso = useMemo(
        () => depenses.reduce((t, d) => t + Number(d.montant), 0),
        [depenses]
    );

    const getProduitNom = (id: number) => {
        const produit = produits?.find((p: any) => p.id === id);
        return produit?.nom || `Produit #${id}`;
    };

    const formatPrice = (value: number) => `${Number(value).toLocaleString("fr-FR")} Ar`;

    // GESTION DÉPENSES PERSO
    const openCreateDepense = () => {
        setEditingDepense(null);
        setForm(initialDepenseForm);
        setModalVisible(true);
    };

    const openEditDepense = (depense: DepensePersonnelle) => {
        setEditingDepense(depense);
        setForm({
            titre: depense.titre,
            montant: String(depense.montant),
            categorie: depense.categorie || "",
            observation: depense.observation || "",
        });
        setModalVisible(true);
    };

    const handleSubmitDepense = async () => {
        if (!form.titre.trim()) {
            Alert.alert("Erreur", "Le titre est obligatoire.");
            return;
        }
        const montant = Number(form.montant);
        if (!montant || montant <= 0) {
            Alert.alert("Erreur", "Le montant doit être supérieur à 0.");
            return;
        }
        if (!user?.id) {
            Alert.alert("Erreur", "Utilisateur non connecté.");
            return;
        }

        try {
            setSaving(true);

            if (editingDepense) {
                await editDepense(editingDepense.id, {
                    titre: form.titre.trim(),
                    montant,
                    categorie: form.categorie || undefined,
                    observation: form.observation || undefined,
                });
            } else {
                await addDepense({
                    utilisateur_id: user.id,
                    titre: form.titre.trim(),
                    montant,
                    categorie: form.categorie || undefined,
                    observation: form.observation || undefined,
                });
            }

            setModalVisible(false);
            setEditingDepense(null);
            setForm(initialDepenseForm);
        } catch (error: any) {
            Alert.alert("Erreur", error?.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteDepense = (depense: DepensePersonnelle) => {
        Alert.alert(
            "Supprimer la dépense",
            `Voulez-vous supprimer "${depense.titre}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeDepense(depense.id);
                        } catch (error: any) {
                            Alert.alert(
                                "Erreur",
                                error?.response?.data?.message || "Impossible de supprimer."
                            );
                        }
                    },
                },
            ]
        );
    };

    const loadingPro = loadingAchats || loadingVentes;
    const donneesPro = ongletPro === "achats" ? mesAchats : mesVentes;
    const { styles, colors } = useTheme();

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    paddingBottom: 15,
                }}
            >
                <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.title}>Mes dépenses</Text>
            </View>

            {/* SWITCH PRO / PERSO */}
            <View
                style={{
                    flexDirection: "row",
                    marginHorizontal: 20,
                    marginBottom: 15,
                    backgroundColor: colors.surfaceAlt,
                    borderRadius: 12,
                    padding: 4,
                }}
            >
                <Pressable
                    style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 9,
                        alignItems: "center",
                        backgroundColor: univers === "pro" ? colors.surface : "transparent",
                    }}
                    onPress={() => setUnivers("pro")}
                >
                    <Text style={{ fontWeight: "700", fontSize: 14, color: univers === "pro" ? colors.text : colors.textSecondary }}>
                        Professionnel
                    </Text>
                </Pressable>

                <Pressable
                    style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 9,
                        alignItems: "center",
                        backgroundColor: univers === "perso" ? colors.surface : "transparent",
                    }}
                    onPress={() => setUnivers("perso")}
                >
                    <Text style={{ fontWeight: "700", fontSize: 14, color: univers === "perso" ? colors.text : colors.textSecondary }}>
                        Personnel
                    </Text>
                </Pressable>
            </View>

            {univers === "pro" ? (
                loadingPro && mesAchats.length === 0 && mesVentes.length === 0 ? (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <>
                        <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 12, marginBottom: 20 }}>
                            <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
                                <Text style={{ fontSize: 13, color: colors.textSecondary }}>Total achats</Text>
                                <Text style={[styles.total, { marginTop: 6, fontSize: 18, color: colors.danger }]}>
                                    {formatPrice(totalAchats)}
                                </Text>
                                <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                                    {mesAchats.length} achat{mesAchats.length > 1 ? "s" : ""}
                                </Text>
                            </View>

                            <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
                                <Text style={{ fontSize: 13, color: colors.textSecondary }}>Total ventes</Text>
                                <Text style={[styles.total, { marginTop: 6, fontSize: 18, color: colors.success }]}>
                                    {formatPrice(totalVentes)}
                                </Text>
                                <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                                    {mesVentes.length} vente{mesVentes.length > 1 ? "s" : ""}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                marginHorizontal: 20,
                                marginBottom: 15,
                                backgroundColor: colors.surfaceAlt,
                                borderRadius: 12,
                                padding: 4,
                            }}
                        >
                            <Pressable
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    borderRadius: 9,
                                    alignItems: "center",
                                    backgroundColor: ongletPro === "achats" ? colors.surface : "transparent",
                                }}
                                onPress={() => setOngletPro("achats")}
                            >
                                <Text style={{ fontWeight: "600", fontSize: 14, color: ongletPro === "achats" ? colors.text : colors.textSecondary }}>
                                    Achats
                                </Text>
                            </Pressable>

                            <Pressable
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    borderRadius: 9,
                                    alignItems: "center",
                                    backgroundColor: ongletPro === "ventes" ? colors.surface : "transparent",
                                }}
                                onPress={() => setOngletPro("ventes")}
                            >
                                <Text style={{ fontWeight: "600", fontSize: 14, color: ongletPro === "ventes" ? colors.text : colors.textSecondary }}>
                                    Ventes
                                </Text>
                            </Pressable>
                        </View>

                        <FlatList
                            data={donneesPro}
                            keyExtractor={(item) => String(item.id)}
                            contentContainerStyle={donneesPro.length === 0 ? styles.emptyContainer : styles.list}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                            renderItem={({ item }: { item: any }) => (
                                <View style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>
                                            {getProduitNom(item.produit_id)}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                                            {item.quantite} x {formatPrice(item.prix_unitaire)}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 15, fontWeight: "700", color: ongletPro === "achats" ? colors.danger : colors.success }}>
                                        {ongletPro === "achats" ? "-" : "+"}{formatPrice(item.montant_total)}
                                    </Text>
                                </View>
                            )}
                            ListEmptyComponent={
                                <View style={styles.empty}>
                                    <Ionicons name={ongletPro === "achats" ? "cart-outline" : "cash-outline"} size={50} color={colors.textLight} />
                                    <Text style={[styles.emptyText, { marginTop: 10 }]}>
                                        {ongletPro === "achats" ? "Aucun achat enregistré par vous." : "Aucune vente enregistrée par vous."}
                                    </Text>
                                </View>
                            }
                        />
                    </>
                )
            ) : (
                // ONGLET PERSO
                <>
                    <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                        <View style={[styles.card, { marginBottom: 0 }]}>
                            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Total dépenses personnelles</Text>
                            <Text style={[styles.total, { marginTop: 6, fontSize: 22, color: colors.danger }]}>
                                {formatPrice(totalDepensesPerso)}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                                {depenses.length} dépense{depenses.length > 1 ? "s" : ""}
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        style={[styles.addButton, { marginHorizontal: 20, marginBottom: 15, alignSelf: "flex-start" }]}
                        onPress={openCreateDepense}
                    >
                        <Text style={styles.plus}>+</Text>
                        <Text style={styles.addText}> Ajouter</Text>
                    </Pressable>

                    {loadingDepenses ? (
                        <View style={styles.loading}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={depenses}
                            keyExtractor={(item) => String(item.id)}
                            contentContainerStyle={depenses.length === 0 ? styles.emptyContainer : styles.list}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                            renderItem={({ item }) => (
                                <View style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>
                                            {item.titre}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                                            {item.categorie || "Sans catégorie"} · {new Date(item.date_depense).toLocaleDateString("fr-FR")}
                                        </Text>
                                    </View>

                                    <Text style={{ fontSize: 15, fontWeight: "700", color: colors.danger, marginRight: 10 }}>
                                        -{formatPrice(item.montant)}
                                    </Text>

                                    <Pressable onPress={() => openEditDepense(item)} style={{ padding: 6 }}>
                                        <Ionicons name="create-outline" size={19} color={colors.primary} />
                                    </Pressable>
                                    <Pressable onPress={() => handleDeleteDepense(item)} style={{ padding: 6 }}>
                                        <Ionicons name="trash-outline" size={19} color={colors.danger} />
                                    </Pressable>
                                </View>
                            )}
                            ListEmptyComponent={
                                <View style={styles.empty}>
                                    <Ionicons name="wallet-outline" size={50} color={colors.textLight} />
                                    <Text style={[styles.emptyText, { marginTop: 10 }]}>
                                        Aucune dépense personnelle enregistrée.
                                    </Text>
                                </View>
                            }
                        />
                    )}

                    <DepenseFormModal
                        visible={modalVisible}
                        editingDepense={editingDepense}
                        form={form}
                        saving={saving}
                        onClose={() => setModalVisible(false)}
                        onSubmit={handleSubmitDepense}
                        setForm={setForm}
                    />
                </>
            )}
        </SafeAreaView>
    );
}