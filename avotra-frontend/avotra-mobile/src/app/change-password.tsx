import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { changePassword } from "../services/auth.service";
import { useTheme } from "../constants/theme.constants";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { styles, colors } = useTheme();

    const [ancienMotDePasse, setAncienMotDePasse] = useState("");
    const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!ancienMotDePasse || !nouveauMotDePasse || !confirmation) {
            Alert.alert("Erreur", "Tous les champs sont obligatoires.");
            return;
        }

        if (nouveauMotDePasse.length < 6) {
            Alert.alert("Erreur", "Le nouveau mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        if (nouveauMotDePasse !== confirmation) {
            Alert.alert("Erreur", "La confirmation ne correspond pas au nouveau mot de passe.");
            return;
        }

        try {
            setSaving(true);
            await changePassword(ancienMotDePasse, nouveauMotDePasse);

            Alert.alert("Succès", "Mot de passe modifié avec succès.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert(
                "Erreur",
                error?.response?.data?.message || "Impossible de modifier le mot de passe."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: 55, flexGrow: 1 }]}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 25 }}>
                    <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={styles.title}>Mot de passe</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Ancien mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={colors.textLight}
                        value={ancienMotDePasse}
                        onChangeText={setAncienMotDePasse}
                        secureTextEntry
                    />

                    <Text style={[styles.label, { marginTop: 15 }]}>Nouveau mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="6 caractères minimum"
                        placeholderTextColor={colors.textLight}
                        value={nouveauMotDePasse}
                        onChangeText={setNouveauMotDePasse}
                        secureTextEntry
                    />

                    <Text style={[styles.label, { marginTop: 15 }]}>Confirmer le nouveau mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={colors.textLight}
                        value={confirmation}
                        onChangeText={setConfirmation}
                        secureTextEntry
                    />

                    <Pressable
                        style={[styles.submitButton, saving && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
                                <Text style={styles.submitText}>Modifier le mot de passe</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}