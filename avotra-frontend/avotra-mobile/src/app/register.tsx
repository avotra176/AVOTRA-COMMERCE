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
import { registerUser } from "../services/auth.service";
import { useTheme } from "../constants/theme.constants";

const ROLES = ["gerant", "vendeur", "admin"];

export default function RegisterScreen() {
    const router = useRouter();
    const { styles, colors } = useTheme();

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [telephone, setTelephone] = useState("");
    const [role, setRole] = useState("vendeur");
    const [saving, setSaving] = useState(false);

    const handleRegister = async () => {
        if (!nom.trim() || !email.trim() || !motDePasse.trim()) {
            Alert.alert("Erreur", "Nom, email et mot de passe sont obligatoires.");
            return;
        }
        if (motDePasse.length < 6) {
            Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        try {
            setSaving(true);
            await registerUser({
                nom: nom.trim(),
                prenom: prenom.trim(),
                email: email.trim(),
                mot_de_passe: motDePasse,
                telephone: telephone.trim(),
                role,
            });

            Alert.alert("Succès", "Compte créé avec succès.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert(
                "Erreur",
                error?.response?.data?.message || "Impossible de créer le compte."
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
                    <Text style={styles.title}>Nouveau compte</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Nom *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex : Rakoto"
                        placeholderTextColor={colors.textLight}
                        value={nom}
                        onChangeText={setNom}
                    />

                    <Text style={[styles.label, { marginTop: 15 }]}>Prénom</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex : Jean"
                        placeholderTextColor={colors.textLight}
                        value={prenom}
                        onChangeText={setPrenom}
                    />

                    <Text style={[styles.label, { marginTop: 15 }]}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="exemple@email.com"
                        placeholderTextColor={colors.textLight}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={[styles.label, { marginTop: 15 }]}>Mot de passe *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="6 caractères minimum"
                        placeholderTextColor={colors.textLight}
                        value={motDePasse}
                        onChangeText={setMotDePasse}
                        secureTextEntry
                    />

                    <Text style={[styles.label, { marginTop: 15 }]}>Téléphone</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex : 034 12 345 67"
                        placeholderTextColor={colors.textLight}
                        value={telephone}
                        onChangeText={setTelephone}
                        keyboardType="phone-pad"
                    />

                    <Text style={[styles.label, { marginTop: 15 }]}>Rôle</Text>
                    <View style={styles.categories}>
                        {ROLES.map((r) => (
                            <Pressable
                                key={r}
                                style={[styles.category, role === r && styles.categorySelected]}
                                onPress={() => setRole(r)}
                            >
                                <Text style={[styles.categoryText, role === r && styles.categoryTextSelected]}>
                                    {r}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable
                        style={[styles.submitButton, saving && styles.disabledButton]}
                        onPress={handleRegister}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Ionicons name="person-add-outline" size={20} color={colors.white} />
                                <Text style={styles.submitText}>Créer le compte</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}