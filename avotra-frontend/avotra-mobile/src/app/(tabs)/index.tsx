import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../constants/auth.constants";
import { useVentes } from "../../hooks/useVentes";
import { useProduits } from "../../hooks/useProduits";
import { styles } from "../../styles/styles.global";

const SEUIL_STOCK_FAIBLE = 5;

export default function HomeScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { ventes, loading: loadingVentes, fetchVentes } = useVentes();
    const { produits, loading: loadingProduits, refresh: refreshProduits } = useProduits();

    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchVentes(), refreshProduits()]);
        setRefreshing(false);
    };

    const chiffreAffaires = useMemo(
        () => ventes.reduce((total, v) => total + Number(v.montant_total), 0),
        [ventes]
    );

    const stockTotal = useMemo(
        () => (produits || []).reduce((total, p: any) => total + Number(p.stock), 0),
        [produits]
    );

    const produitsStockFaible = useMemo(
        () =>
            (produits || [])
                .filter((p: any) => Number(p.stock) <= SEUIL_STOCK_FAIBLE)
                .sort((a: any, b: any) => a.stock - b.stock),
        [produits]
    );

    const dernieresVentes = useMemo(
        () => [...ventes].slice(0, 5),
        [ventes]
    );

    const getProduitNom = (id: number) => {
        const produit = produits?.find((p: any) => p.id === id);
        return produit?.nom || `Produit #${id}`;
    };

    const formatPrice = (value: number) => `${Number(value).toLocaleString("fr-FR")} Ar`;

    const loading = loadingVentes || loadingProduits;

    if (loading && ventes.length === 0 && (produits || []).length === 0) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingTop: 55 }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            <Text style={[styles.title, { fontSize: 28 }]}>
                AVOTRA COMMERCE
            </Text>

            <Text style={[styles.listText, { marginTop: 8, fontSize: 16 }]}>
                Bonjour {user?.nom || user?.email}
            </Text>

            <Text style={[styles.title, { fontSize: 23, marginTop: 35, marginBottom: 20 }]}>
                Tableau de bord
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    rowGap: 15,
                }}
            >
                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Chiffre d'affaires
                    </Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 22 }]}>
                        {formatPrice(chiffreAffaires)}
                    </Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Ventes
                    </Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 22 }]}>
                        {ventes.length}
                    </Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Produits
                    </Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 22 }]}>
                        {(produits || []).length}
                    </Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Stock total
                    </Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 22 }]}>
                        {stockTotal}
                    </Text>
                </View>
            </View>

            {produitsStockFaible.length > 0 && (
                <>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 35, marginBottom: 15 }}>
                        <Ionicons name="warning-outline" size={22} color="#DC2626" />
                        <Text style={[styles.title, { fontSize: 20, marginLeft: 8 }]}>
                            Stock faible
                        </Text>
                    </View>

                    <View style={{ gap: 10 }}>
                        {produitsStockFaible.slice(0, 5).map((produit: any) => (
                            <Pressable
                                key={produit.id}
                                style={[
                                    styles.card,
                                    {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderLeftWidth: 4,
                                        borderLeftColor: produit.stock <= 0 ? "#DC2626" : "#F59E0B",
                                    },
                                ]}
                                onPress={() => router.push("/produits")}
                            >
                                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                                    {produit.nom}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "700",
                                        color: produit.stock <= 0 ? "#DC2626" : "#F59E0B",
                                    }}
                                >
                                    {produit.stock <= 0 ? "Rupture" : `${produit.stock} restant(s)`}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </>
            )}

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 35, marginBottom: 15 }}>
                <Ionicons name="time-outline" size={22} color="#2563EB" />
                <Text style={[styles.title, { fontSize: 20, marginLeft: 8 }]}>
                    Dernières ventes
                </Text>
            </View>

            {dernieresVentes.length === 0 ? (
                <View style={styles.card}>
                    <Text style={{ textAlign: "center", color: "#64748B" }}>
                        Aucune vente enregistrée
                    </Text>
                </View>
            ) : (
                <View style={{ gap: 10, marginBottom: 30 }}>
                    {dernieresVentes.map((vente) => (
                        <Pressable
                            key={vente.id}
                            style={[
                                styles.card,
                                { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
                            ]}
                            onPress={() => router.push("/ventes")}
                        >
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                                    {getProduitNom(vente.produit_id)}
                                </Text>
                                <Text style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
                                    {new Date(vente.date_vente).toLocaleDateString("fr-FR")}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 15, fontWeight: "700", color: "#16A34A" }}>
                                {formatPrice(vente.montant_total)}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}