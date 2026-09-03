import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/styles.global";
import { Fournisseur, CreateFournisseur } from "@/types/fournisseur.types";

interface Props {
    visible: boolean;
    fournisseurs: Fournisseur[];
    selectedId: number | null;
    onClose: () => void;
    onSelect: (fournisseur: Fournisseur) => void;
    onCreate: (data: CreateFournisseur) => Promise<Fournisseur>;
}

const emptyNewFournisseur: CreateFournisseur = {
    nom: "",
    contact: "",
    telephone: "",
    email: "",
    adresse: "",
};

export default function FournisseurPicker({
    visible,
    fournisseurs,
    selectedId,
    onClose,
    onSelect,
    onCreate,
}: Props) {
    const [query, setQuery] = useState("");
    const [creating, setCreating] = useState(false);
    const [mode, setMode] = useState<"list" | "form">("list");
    const [newFournisseur, setNewFournisseur] = useState<CreateFournisseur>(
        emptyNewFournisseur
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return fournisseurs;
        return fournisseurs.filter((f) =>
            f.nom.toLowerCase().includes(q)
        );
    }, [query, fournisseurs]);

    const exactMatch = useMemo(
        () =>
            fournisseurs.some(
                (f) => f.nom.toLowerCase() === query.trim().toLowerCase()
            ),
        [query, fournisseurs]
    );

    const resetAndClose = () => {
        setQuery("");
        setMode("list");
        setNewFournisseur(emptyNewFournisseur);
        onClose();
    };

    const openCreateForm = () => {
        setNewFournisseur({ ...emptyNewFournisseur, nom: query.trim() });
        setMode("form");
    };

    const handleCreate = async () => {
        if (!newFournisseur.nom.trim() || creating) return;

        setCreating(true);
        try {
            const nouveau = await onCreate(newFournisseur);
            onSelect(nouveau);
            resetAndClose();
        } catch (err) {
            console.log("Erreur création fournisseur:", err);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={resetAndClose}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        {mode === "form" && (
                            <Pressable
                                onPress={() => setMode("list")}
                                style={{ marginRight: 12 }}
                            >
                                <Ionicons name="arrow-back" size={24} />
                            </Pressable>
                        )}

                        <Text style={styles.modalTitle}>
                            {mode === "list" ? "Fournisseur" : "Nouveau fournisseur"}
                        </Text>

                        <Pressable onPress={resetAndClose} style={{ marginLeft: "auto" }}>
                            <Ionicons name="close" size={28} />
                        </Pressable>
                    </View>

                    {mode === "list" ? (
                        <>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#ddd",
                                    borderRadius: 8,
                                    paddingHorizontal: 10,
                                    marginBottom: 12,
                                }}
                            >
                                <Ionicons name="search" size={18} color="#888" />
                                <TextInput
                                    style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8 }}
                                    placeholder="Rechercher ou créer un fournisseur..."
                                    value={query}
                                    onChangeText={setQuery}
                                    autoFocus
                                />
                            </View>

                            <FlatList
                                data={filtered}
                                keyExtractor={(item) => String(item.id)}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={[
                                            styles.choice,
                                            selectedId === item.id && styles.choiceSelected,
                                            { marginBottom: 8 },
                                        ]}
                                        onPress={() => {
                                            onSelect(item);
                                            resetAndClose();
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.choiceText,
                                                selectedId === item.id && styles.choiceTextSelected,
                                            ]}
                                        >
                                            {item.nom}
                                        </Text>
                                    </Pressable>
                                )}
                                ListEmptyComponent={
                                    !query.trim() ? (
                                        <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
                                            Aucun fournisseur enregistré
                                        </Text>
                                    ) : null
                                }
                                ListFooterComponent={
                                    query.trim() && !exactMatch ? (
                                        <Pressable
                                            onPress={openCreateForm}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                padding: 14,
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                borderStyle: "dashed",
                                                borderColor: "#4a90e2",
                                                marginTop: 8,
                                            }}
                                        >
                                            <Ionicons name="add-circle-outline" size={20} color="#4a90e2" />
                                            <Text style={{ marginLeft: 8, color: "#4a90e2" }}>
                                                Créer "{query.trim()}" comme nouveau fournisseur
                                            </Text>
                                        </Pressable>
                                    ) : null
                                }
                            />
                        </>
                    ) : (
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <Text style={styles.label}>Nom *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex : Rakoto SARL"
                                value={newFournisseur.nom}
                                onChangeText={(text) =>
                                    setNewFournisseur((prev) => ({ ...prev, nom: text }))
                                }
                            />

                            <Text style={styles.label}>Contact</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom du contact"
                                value={newFournisseur.contact}
                                onChangeText={(text) =>
                                    setNewFournisseur((prev) => ({ ...prev, contact: text }))
                                }
                            />

                            <Text style={styles.label}>Téléphone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex : 034 12 345 67"
                                keyboardType="phone-pad"
                                value={newFournisseur.telephone}
                                onChangeText={(text) =>
                                    setNewFournisseur((prev) => ({ ...prev, telephone: text }))
                                }
                            />

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex : contact@fournisseur.mg"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={newFournisseur.email}
                                onChangeText={(text) =>
                                    setNewFournisseur((prev) => ({ ...prev, email: text }))
                                }
                            />

                            <Text style={styles.label}>Adresse</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Adresse complète"
                                multiline
                                value={newFournisseur.adresse}
                                onChangeText={(text) =>
                                    setNewFournisseur((prev) => ({ ...prev, adresse: text }))
                                }
                            />

                            <Pressable
                                style={[
                                    styles.submitButton,
                                    (creating || !newFournisseur.nom.trim()) &&
                                    styles.disabledButton,
                                ]}
                                onPress={handleCreate}
                                disabled={creating || !newFournisseur.nom.trim()}
                            >
                                {creating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={22}
                                            color="#fff"
                                        />
                                        <Text style={styles.submitText}>
                                            Enregistrer le fournisseur
                                        </Text>
                                    </>
                                )}
                            </Pressable>
                        </ScrollView>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}