import React from "react";
import {
    ActivityIndicator,
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
import { DepensePersonnelle, DepenseFormState, CATEGORIES_DEPENSE } from "@/types/depense.types";
import { useTheme } from "../../constants/theme.constants";

interface Props {
    visible: boolean;
    editingDepense: DepensePersonnelle | null;
    form: DepenseFormState;
    saving: boolean;
    onClose: () => void;
    onSubmit: () => void;
    setForm: React.Dispatch<React.SetStateAction<DepenseFormState>>;
}

export default function DepenseFormModal({
    visible,
    editingDepense,
    form,
    saving,
    onClose,
    onSubmit,
    setForm,
}: Props) {
    const { styles, colors } = useTheme();
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.modalBackground}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.modal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editingDepense ? "Modifier la dépense" : "Nouvelle dépense"}
                        </Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={28} />
                        </Pressable>
                    </View>

                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={styles.label}>Titre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex : Déjeuner, Taxi-be..."
                            value={form.titre}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, titre: text }))}
                        />

                        <Text style={styles.label}>Montant</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex : 5000"
                            keyboardType="numeric"
                            value={form.montant}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, montant: text }))}
                        />

                        <Text style={styles.label}>Catégorie</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {CATEGORIES_DEPENSE.map((cat) => (
                                <Pressable
                                    key={cat}
                                    style={[
                                        styles.choice,
                                        form.categorie === cat && styles.choiceSelected,
                                    ]}
                                    onPress={() => setForm((prev) => ({ ...prev, categorie: cat }))}
                                >
                                    <Text
                                        style={[
                                            styles.choiceText,
                                            form.categorie === cat && styles.choiceTextSelected,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Text style={styles.label}>Note (optionnel)</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="Détail supplémentaire..."
                            multiline
                            value={form.observation}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, observation: text }))}
                        />

                        <Pressable
                            style={[styles.submitButton, saving && styles.disabledButton]}
                            onPress={onSubmit}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                                    <Text style={styles.submitText}>
                                        {editingDepense ? "Modifier" : "Enregistrer"}
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}