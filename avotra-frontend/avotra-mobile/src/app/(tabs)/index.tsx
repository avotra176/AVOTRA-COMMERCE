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
import AppHeader from "../../components/ui/AppHeader";
import { SafeAreaView } from 'react-native-safe-area-context';


const SEUIL_STOCK_FAIBLE = 5;
const RING_SIZE = 130;
const RING_STROKE = 12;

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

    // STATS
    const chiffreAffaires = useMemo(
        () => ventes.reduce((total, v) => total + Number(v.montant_total), 0),
        [ventes]
    );

    const totalAchats = useMemo(
        () => achats.reduce((total, a) => total + Number(a.montant_total), 0),
        [achats]
    );

    const beneficeNet = chiffreAffaires - totalAchats;

    const totalProduits = (produits || []).length;

    const produitsRupture = useMemo(
        () => (produits || []).filter((p: any) => Number(p.stock) <= 0),
        [produits]
    );

    const produitsStockFaible = useMemo(
        () =>
            (produits || [])
                .filter((p: any) => Number(p.stock) > 0 && Number(p.stock) <= SEUIL_STOCK_FAIBLE)
                .sort((a: any, b: any) => a.stock - b.stock),
        [produits]
    );

    const produitsBienApprovisionnes = totalProduits - produitsRupture.length - produitsStockFaible.length;

    // SCORE DE SANTÉ DU STOCK (0-100)
    const scoreStock = useMemo(() => {
        if (totalProduits === 0) return 0;
        const ratioOk = produitsBienApprovisionnes / totalProduits;
        const ratioRupture = produitsRupture.length / totalProduits;
        // pénalise fortement les ruptures, un peu moins le stock faible
        const score = ratioOk * 100 - ratioRupture * 30;
        return Math.max(0, Math.min(100, Math.round(score)));
    }, [totalProduits, produitsBienApprovisionnes, produitsRupture]);

    const scoreLabel =
        scoreStock >= 80 ? "Excellent" : scoreStock >= 50 ? "Correct" : "À surveiller";

    const scoreColor =
        scoreStock >= 80 ? colors.success : scoreStock >= 50 ? colors.warning : colors.danger;

    const pctBienApprovisionne = totalProduits ? Math.round((produitsBienApprovisionnes / totalProduits) * 100) : 0;
    const pctStockFaible = totalProduits ? Math.round((produitsStockFaible.length / totalProduits) * 100) : 0;
    const pctRupture = totalProduits ? Math.round((produitsRupture.length / totalProduits) * 100) : 0;

    // PRODUITS À SURVEILLER (rupture + faible), pour la liste horizontale
    const produitsASurveiller = useMemo(
        () => [...produitsRupture, ...produitsStockFaible].slice(0, 8),
        [produitsRupture, produitsStockFaible]
    );

    const formatPrice = (value: number) => `${Number(value).toLocaleString("fr-FR")} Ar`;

    const loading = loadingVentes || loadingProduits || loadingAchats;

    if (loading && ventes.length === 0 && (produits || []).length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Calcul du cercle SVG
    const radius = (RING_SIZE - RING_STROKE) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (scoreStock / 100) * circumference;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <AppHeader
                title="AVOTRA COMMERCE"
                subtitle={`Bonjour ${user?.nom || user?.email}`}
                rightIcon="notifications-outline"
                onRightPress={() => { }}

            />


            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingTop: 55 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >

                {/* SCORE DE SANTÉ DU STOCK */}
                <View style={[styles.card, { marginTop: 25, flexDirection: "row", alignItems: "center" }]}>
                    <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: "center", justifyContent: "center" }}>
                        <ProgressRing
                            size={RING_SIZE}
                            strokeWidth={RING_STROKE}
                            percentage={scoreStock}
                            color={scoreColor}
                            trackColor={colors.surfaceAlt}
                        />
                        <View style={{ position: "absolute", alignItems: "center" }}>
                            <Text style={{ fontSize: 30, fontWeight: "800", color: colors.text }}>
                                {scoreStock}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                                {scoreLabel}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 10 }}>
                            Santé du stock
                        </Text>

                        <View style={{ marginBottom: 8 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Bien approvisionné</Text>
                                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.success }}>{pctBienApprovisionne}%</Text>
                            </View>
                            <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.surfaceAlt }}>
                                <View style={{ height: 5, borderRadius: 3, width: `${pctBienApprovisionne}%`, backgroundColor: colors.success }} />
                            </View>
                        </View>

                        <View style={{ marginBottom: 8 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Stock faible</Text>
                                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.warning }}>{pctStockFaible}%</Text>
                            </View>
                            <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.surfaceAlt }}>
                                <View style={{ height: 5, borderRadius: 3, width: `${pctStockFaible}%`, backgroundColor: colors.warning }} />
                            </View>
                        </View>

                        <View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>En rupture</Text>
                                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.danger }}>{pctRupture}%</Text>
                            </View>
                            <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.surfaceAlt }}>
                                <View style={{ height: 5, borderRadius: 3, width: `${pctRupture}%`, backgroundColor: colors.danger }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* À SURVEILLER */}
                {produitsASurveiller.length > 0 && (
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30, marginBottom: 12 }}>
                            <View>
                                <Text style={{ fontSize: 12, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    À réapprovisionner
                                </Text>
                                <Text style={[styles.title, { fontSize: 20, marginTop: 2 }]}>À surveiller</Text>
                            </View>
                            <Pressable onPress={() => router.push("/produits")}>
                                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}>Voir tout</Text>
                            </Pressable>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
                            {produitsASurveiller.map((produit: any) => {
                                const rupture = produit.stock <= 0;
                                return (
                                    <Pressable
                                        key={produit.id}
                                        style={{
                                            width: 130,
                                            backgroundColor: colors.surface,
                                            borderRadius: 16,
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                            padding: 12,
                                        }}
                                        onPress={() => router.push("/produits")}
                                    >
                                        <View
                                            style={{
                                                alignSelf: "flex-start",
                                                paddingHorizontal: 8,
                                                paddingVertical: 3,
                                                borderRadius: 999,
                                                backgroundColor: rupture ? colors.dangerSoft : colors.accentSoft,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 10, fontWeight: "700", color: rupture ? colors.danger : colors.accent }}>
                                                {rupture ? "Rupture" : "Stock bas"}
                                            </Text>
                                        </View>

                                        <View
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10,
                                                backgroundColor: colors.primarySoft,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Ionicons name="cube-outline" size={20} color={colors.primary} />
                                        </View>

                                        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                                            {produit.nom}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                                            {produit.stock} {produit.unite}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </>
                )}

                {/* ACTIONS RAPIDES */}
                <Text style={[styles.title, { fontSize: 20, marginTop: 30, marginBottom: 12 }]}>
                    Actions rapides
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 }}>
                    <Pressable
                        style={{
                            width: "48%",
                            backgroundColor: colors.primary,
                            borderRadius: 18,
                            padding: 18,
                            minHeight: 100,
                            justifyContent: "space-between",
                        }}
                        onPress={() => router.push("/ventes")}
                    >
                        <Ionicons name="cash-outline" size={24} color={colors.white} />
                        <Text style={{ color: colors.white, fontWeight: "700", fontSize: 14, marginTop: 10 }}>
                            Nouvelle vente
                        </Text>
                    </Pressable>

                    <Pressable
                        style={{
                            width: "48%",
                            backgroundColor: colors.surface,
                            borderRadius: 18,
                            padding: 18,
                            minHeight: 100,
                            justifyContent: "space-between",
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                        onPress={() => router.push("/achats")}
                    >
                        <Ionicons name="cart-outline" size={24} color={colors.text} />
                        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14, marginTop: 10 }}>
                            Nouvel achat
                        </Text>
                    </Pressable>

                    <Pressable
                        style={{
                            width: "48%",
                            backgroundColor: colors.surface,
                            borderRadius: 18,
                            padding: 18,
                            minHeight: 100,
                            justifyContent: "space-between",
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                        onPress={() => router.push("/produits")}
                    >
                        <Ionicons name="add-circle-outline" size={24} color={colors.text} />
                        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14, marginTop: 10 }}>
                            Ajouter produit
                        </Text>
                    </Pressable>

                    <Pressable
                        style={{
                            width: "48%",
                            backgroundColor: colors.surface,
                            borderRadius: 18,
                            padding: 18,
                            minHeight: 100,
                            justifyContent: "space-between",
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                        onPress={() => router.push("/mes-depenses")}
                    >
                        <Ionicons name="wallet-outline" size={24} color={colors.text} />
                        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14, marginTop: 10 }}>
                            Mes dépenses
                        </Text>
                    </Pressable>
                </View>

                {/* RÉSUMÉ FINANCIER (repris de l'ancien dashboard, condensé) */}
                <Text style={[styles.title, { fontSize: 20, marginTop: 30, marginBottom: 12 }]}>
                    Résumé
                </Text>

                <View style={{ flexDirection: "row", gap: 12, marginBottom: 30 }}>
                    <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>Chiffre d'affaires</Text>
                        <Text style={[styles.total, { marginTop: 6, fontSize: 17 }]}>{formatPrice(chiffreAffaires)}</Text>
                    </View>

                    <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>Bénéfice net</Text>
                        <Text
                            style={[
                                styles.total,
                                { marginTop: 6, fontSize: 17, color: beneficeNet >= 0 ? colors.success : colors.danger },
                            ]}
                        >
                            {formatPrice(beneficeNet)}
                        </Text>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>

    );
};
function ProgressRing({
    size,
    strokeWidth,
    percentage,
    color,
    trackColor,
}: {
    size: number;
    strokeWidth: number;
    percentage: number;
    color: string;
    trackColor: string;
}) {
    const clamped = Math.max(0, Math.min(100, percentage));
    const rotation = (clamped / 100) * 360;

    return (
        <View style={{ width: size, height: size }}>
            {/* Piste de fond */}
            <View
                style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: trackColor,
                }}
            />

            {/* Moitié gauche (0-50%) */}
            <View
                style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: "transparent",
                    borderTopColor: clamped > 0 ? color : "transparent",
                    borderRightColor: clamped > 25 ? color : "transparent",
                    transform: [{ rotate: `${Math.min(rotation, 180)}deg` }],
                }}
            />

            {/* Moitié droite (50-100%), affichée seulement au-delà de 50% */}
            {clamped > 50 && (
                <View
                    style={{
                        position: "absolute",
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: "transparent",
                        borderBottomColor: color,
                        borderLeftColor: clamped > 75 ? color : "transparent",
                        transform: [{ rotate: `${rotation - 180}deg` }],
                    }}
                />
            )}
        </View>
    );
}