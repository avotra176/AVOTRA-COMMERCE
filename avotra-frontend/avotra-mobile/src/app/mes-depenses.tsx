import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
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
import { useAuth } from "../constants/auth.constants";
import { Achat } from "../types/achat.types";
import { styles, colors } from "../styles/styles.global";

type Onglet = "achats" | "ventes";

export default function MesDepensesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { produits } = useProduits();
    const { ventes, loading: loadingVentes, fetchVentes } = useVentes();

    const [achats, setAchats] = useState<Achat[]>([]);
    const [loadingAchats, setLoadingAchats] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [onglet, setOnglet] = useState<Onglet>("achats");

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
        await Promise.all([loadAchats(), fetchVentes()]);
        setRefreshing(false);
    };

    // FILTRAGE SUR L'UTILISATEUR CONNECTÉ
    const mesAchats = useMemo(
        () => achats.filter((a) => a.utilisateur_id === user?.id),
        [achats, user?.id]
    );

    const mesVentes = useMemo(
        () => ventes.filter((v) => v.utilisateur_id === user?.id),
        [ventes, user?.id]
    );

    const totalAchats = useMemo(
        () => mesAchats.reduce((total, a) => total + Number(a.montant_total), 0),
        [mesAchats]
    );

    const totalVentes = useMemo(
        () => mesVentes.reduce((total, v) => total + Number(v.montant_total), 0),
        [mesVentes]
    );

    const getProduitNom = (id: number) => {
        const produit = produits?.find((p: any) => p.id === id);
        return produit?.nom || `Produit #${id}`;
    };

    const formatPrice = (value: number) => `${Number(value).toLocaleString("fr-FR")} Ar`;

    const loading = loadingAchats || loadingVentes;
    const donnees = onglet === "achats" ? mesAchats : mesVentes;

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER AVEC RETOUR */}
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

            {loading && mesAchats.length === 0 && mesVentes.length === 0 ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <>
                    {/* RÉCAP */}
                    <View
                        style={{
                            flexDirection: "row",
                            paddingHorizontal: 20,
                            gap: 12,
                            marginBottom: 20,
                        }}
                    >
                        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
                            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                                Total achats
                            </Text>
                            <Text style={[styles.total, { marginTop: 6, fontSize: 18, color: colors.danger }]}>
                                {formatPrice(totalAchats)}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                                {mesAchats.length} achat{mesAchats.length > 1 ? "s" : ""}
                            </Text>
                        </View>

                        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
                            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                                Total ventes
                            </Text>
                            <Text style={[styles.total, { marginTop: 6, fontSize: 18, color: colors.success }]}>
                                {formatPrice(totalVentes)}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                                {mesVentes.length} vente{mesVentes.length > 1 ? "s" : ""}
                            </Text>
                        </View>
                    </View>

                    {/* ONGLETS */}
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
                                backgroundColor: onglet === "achats" ? colors.surface : "transparent",
                            }}
                            onPress={() => setOnglet("achats")}
                        >
                            <Text
                                style={{
                                    fontWeight: "600",
                                    fontSize: 14,
                                    color: onglet === "achats" ? colors.text : colors.textSecondary,
                                }}
                            >
                                Achats
                            </Text>
                        </Pressable>

                        <Pressable
                            style={{
                                flex: 1,
                                paddingVertical: 10,
                                borderRadius: 9,
                                alignItems: "center",
                                backgroundColor: onglet === "ventes" ? colors.surface : "transparent",
                            }}
                            onPress={() => setOnglet("ventes")}
                        >
                            <Text
                                style={{
                                    fontWeight: "600",
                                    fontSize: 14,
                                    color: onglet === "ventes" ? colors.text : colors.textSecondary,
                                }}
                            >
                                Ventes
                            </Text>
                        </Pressable>
                    </View>

                    {/* LISTE */}
                    <FlatList
                        data={donnees}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={
                            donnees.length === 0 ? styles.emptyContainer : styles.list
                        }
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                        renderItem={({ item }: { item: any }) => (
                            <View
                                style={[
                                    styles.card,
                                    {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    },
                                ]}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>
                                        {getProduitNom(item.produit_id)}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                                        {item.quantite} x {formatPrice(item.prix_unitaire)}
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "700",
                                        color: onglet === "achats" ? colors.danger : colors.success,
                                    }}
                                >
                                    {onglet === "achats" ? "-" : "+"}
                                    {formatPrice(item.montant_total)}
                                </Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Ionicons
                                    name={onglet === "achats" ? "cart-outline" : "cash-outline"}
                                    size={50}
                                    color={colors.textLight}
                                />
                                <Text style={[styles.emptyText, { marginTop: 10 }]}>
                                    {onglet === "achats"
                                        ? "Aucun achat enregistré par vous."
                                        : "Aucune vente enregistrée par vous."}
                                </Text>
                            </View>
                        }
                    />
                </>
            )}
        </SafeAreaView>
    );
}