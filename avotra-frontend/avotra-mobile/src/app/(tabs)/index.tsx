import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../constants/auth.constants";
import { useTheme } from "../../constants/theme.constants";
import { useVentes } from "../../hooks/useVentes";
import { useProduits } from "../../hooks/useProduits";
import { useDepenses } from "../../hooks/useDepenses";
import { getAchats } from "../../services/achat.service";
import { Achat } from "../../types/achat.types";

const SEUIL_STOCK_FAIBLE = 5;

export default function HomeScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { styles, colors } = useTheme();
    const { ventes, loading: loadingVentes, fetchVentes } = useVentes();
    const { produits, loading: loadingProduits, refresh: refreshProduits } = useProduits();
    const { depenses, fetchDepenses } = useDepenses(user?.id);

    const [achats, setAchats] = useState<Achat[]>([]);
    const [loadingAchats, setLoadingAchats] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
        await Promise.all([fetchVentes(), refreshProduits(), fetchDepenses(), loadAchats()]);
        setRefreshing(false);
    };

    const chiffreAffaires = useMemo(
        () => ventes.reduce((total, v) => total + Number(v.montant_total), 0),
        [ventes]
    );

    const totalAchats = useMemo(
        () => achats.reduce((total, a) => total + Number(a.montant_total), 0),
        [achats]
    );

    const beneficeNet = chiffreAffaires - totalAchats;

    const stockTotal = useMemo(
        () => (produits || []).reduce((total, p: any) => total + Number(p.stock), 0),
        [produits]
    );

    const valeurStock = useMemo(
        () => (produits || []).reduce((total, p: any) => total + Number(p.stock) * Number(p.prix_vente), 0),
        [produits]
    );

    const produitsStockFaible = useMemo(
        () =>
            (produits || [])
                .filter((p: any) => Number(p.stock) <= SEUIL_STOCK_FAIBLE)
                .sort((a: any, b: any) => a.stock - b.stock),
        [produits]
    );

    const dernieresVentes = useMemo(() => [...ventes].slice(0, 5), [ventes]);

    const ventes7Jours = useMemo(() => {
        const jours = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        return jours.map((date) => {
            const cle = date.toISOString().split("T")[0];
            const total = ventes
                .filter((v) => v.date_vente?.split("T")[0] === cle)
                .reduce((sum, v) => sum + Number(v.montant_total), 0);

            const label = date
                .toLocaleDateString("fr-FR", { weekday: "short" })
                .replace(".", "");

            return { label, total, isToday: cle === new Date().toISOString().split("T")[0] };
        });
    }, [ventes]);

    const maxVente7Jours = Math.max(...ventes7Jours.map((j) => j.total), 1);

    const depensesDuMois = useMemo(() => {
        const now = new Date();
        return depenses.filter((d) => {
            const date = new Date(d.date_depense);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
    }, [depenses]);

    const totalDepensesMois = useMemo(
        () => depensesDuMois.reduce((total, d) => total + Number(d.montant), 0),
        [depensesDuMois]
    );

    const getProduitNom = (id: number) => {
        const produit = produits?.find((p: any) => p.id === id);
        return produit?.nom || `Produit #${id}`;
    };

    const formatPrice = (value: number) => `${Number(value).toLocaleString("fr-FR")} Ar`;

    const loading = loadingVentes || loadingProduits || loadingAchats;

    if (loading && ventes.length === 0 && (produits || []).length === 0) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingTop: 55 }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
            <Text style={[styles.title, { fontSize: 28 }]}>AVOTRA COMMERCE</Text>

            <Text style={[styles.listText, { marginTop: 8, fontSize: 16 }]}>
                Bonjour {user?.nom || user?.email}
            </Text>

            <Text style={[styles.title, { fontSize: 23, marginTop: 35, marginBottom: 20 }]}>
                Tableau de bord
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 15 }}>
                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: colors.textSecondary }}>Chiffre d'affaires</Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 20 }]}>
                        {formatPrice(chiffreAffaires)}
                    </Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: colors.textSecondary }}>Ventes</Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 22 }]}>{ventes.length}</Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: colors.textSecondary }}>Produits</Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 22 }]}>
                        {(produits || []).length}
                    </Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: colors.textSecondary }}>Stock total</Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 22 }]}>{stockTotal}</Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: colors.textSecondary }}>Bénéfice net</Text>
                    <Text
                        style={[
                            styles.total,
                            { marginTop: 8, fontSize: 20, color: beneficeNet >= 0 ? colors.success : colors.danger },
                        ]}
                    >
                        {formatPrice(beneficeNet)}
                    </Text>
                </View>

                <View style={[styles.card, { width: "48%" }]}>
                    <Text style={{ fontSize: 15, color: colors.textSecondary }}>Valeur du stock</Text>
                    <Text style={[styles.total, { marginTop: 8, fontSize: 20 }]}>
                        {formatPrice(valeurStock)}
                    </Text>
                </View>
            </View>

            <Text style={[styles.title, { fontSize: 20, marginTop: 35, marginBottom: 15 }]}>
                Ventes — 7 derniers jours
            </Text>

            <View style={styles.card}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        height: 110,
                        marginBottom: 8,
                    }}
                >
                    {ventes7Jours.map((jour, index) => {
                        const hauteur = (jour.total / maxVente7Jours) * 90;
                        return (
                            <View key={index} style={{ alignItems: "center", flex: 1 }}>
                                <View
                                    style={{
                                        width: 18,
                                        height: Math.max(hauteur, 3),
                                        borderRadius: 6,
                                        backgroundColor: jour.isToday ? colors.primary : colors.primarySoft,
                                    }}
                                />
                            </View>
                        );
                    })}
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {ventes7Jours.map((jour, index) => (
                        <Text
                            key={index}
                            style={{
                                flex: 1,
                                textAlign: "center",
                                fontSize: 12,
                                fontWeight: jour.isToday ? "700" : "500",
                                color: jour.isToday ? colors.primary : colors.textSecondary,
                                textTransform: "capitalize",
                            }}
                        >
                            {jour.label}
                        </Text>
                    ))}
                </View>
            </View>

            {produitsStockFaible.length > 0 && (
                <>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 35, marginBottom: 15 }}>
                        <Ionicons name="warning-outline" size={22} color={colors.danger} />
                        <Text style={[styles.title, { fontSize: 20, marginLeft: 8 }]}>Stock faible</Text>
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
                                        borderLeftColor: produit.stock <= 0 ? colors.danger : colors.warning,
                                    },
                                ]}
                                onPress={() => router.push("/produits")}
                            >
                                <Text style={{ fontSize: 15, fontWeight: "500", color: colors.text }}>
                                    {produit.nom}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "700",
                                        color: produit.stock <= 0 ? colors.danger : colors.warning,
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
                <Ionicons name="wallet-outline" size={22} color={colors.accent} />
                <Text style={[styles.title, { fontSize: 20, marginLeft: 8 }]}>Mes dépenses ce mois</Text>
            </View>

            <Pressable
                style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
                onPress={() => router.push("/mes-depenses")}
            >
                <View>
                    <Text style={{ fontSize: 15, fontWeight: "500", color: colors.text }}>
                        {depensesDuMois.length} dépense{depensesDuMois.length > 1 ? "s" : ""} enregistrée
                        {depensesDuMois.length > 1 ? "s" : ""}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                        Voir le détail
                    </Text>
                </View>
                <Text style={{ fontSize: 17, fontWeight: "700", color: colors.danger }}>
                    -{formatPrice(totalDepensesMois)}
                </Text>
            </Pressable>

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 35, marginBottom: 15 }}>
                <Ionicons name="time-outline" size={22} color={colors.primary} />
                <Text style={[styles.title, { fontSize: 20, marginLeft: 8 }]}>Dernières ventes</Text>
            </View>

            {dernieresVentes.length === 0 ? (
                <View style={styles.card}>
                    <Text style={{ textAlign: "center", color: colors.textSecondary }}>
                        Aucune vente enregistrée
                    </Text>
                </View>
            ) : (
                <View style={{ gap: 10, marginBottom: 30 }}>
                    {dernieresVentes.map((vente) => (
                        <Pressable
                            key={vente.id}
                            style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
                            onPress={() => router.push("/ventes")}
                        >
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: "500", color: colors.text }}>
                                    {getProduitNom(vente.produit_id)}
                                </Text>
                                <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                                    {new Date(vente.date_vente).toLocaleDateString("fr-FR")}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.success }}>
                                {formatPrice(vente.montant_total)}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}