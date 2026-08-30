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
import { Achat, FormState } from "../../types/achat.types";
import { styles } from "../../styles/styles.global";

interface Props {
    visible: boolean;
    editingAchat: Achat | null;
    form: FormState;
    produits: any[];
    fournisseurs: any[];
    montantTotal: number;
    saving: boolean;
    onClose: () => void;
    onSubmit: () => void;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

export default function AchatFormModal({
    visible,
    editingAchat,
    form,
    produits,
    fournisseurs,
    montantTotal,
    saving,
    onClose,
    onSubmit,
    setForm,
}: Props) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalBackground}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.modal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editingAchat
                                ? "Modifier l'achat"
                                : "Nouvel achat"}
                        </Text>

                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={28} />
                        </Pressable>
                    </View>

                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={styles.label}>
                            Produit
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {produits.map((produit) => (
                                <Pressable
                                    key={produit.id}
                                    style={[
                                        styles.choice,
                                        form.produit_id === produit.id &&
                                        styles.choiceSelected,
                                    ]}
                                    onPress={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            produit_id: produit.id,
                                        }))
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.choiceText,
                                            form.produit_id === produit.id &&
                                            styles.choiceTextSelected,
                                        ]}
                                    >
                                        {produit.nom}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Text style={styles.label}>
                            Fournisseur
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {fournisseurs.map((fournisseur) => (
                                <Pressable
                                    key={fournisseur.id}
                                    style={[
                                        styles.choice,
                                        form.fournisseur_id === fournisseur.id &&
                                        styles.choiceSelected,
                                    ]}
                                    onPress={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            fournisseur_id: fournisseur.id,
                                        }))
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.choiceText,
                                            form.fournisseur_id === fournisseur.id &&
                                            styles.choiceTextSelected,
                                        ]}
                                    >
                                        {fournisseur.nom}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Text style={styles.label}>
                            Quantité
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ex : 10"
                            keyboardType="numeric"
                            value={form.quantite}
                            onChangeText={(text) =>
                                setForm((prev) => ({
                                    ...prev,
                                    quantite: text,
                                }))
                            }
                        />

                        <Text style={styles.label}>
                            Prix unitaire
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ex : 15000"
                            keyboardType="numeric"
                            value={form.prix_unitaire}
                            onChangeText={(text) =>
                                setForm((prev) => ({
                                    ...prev,
                                    prix_unitaire: text,
                                }))
                            }
                        />

                        <View style={styles.totalBox}>
                            <Text style={styles.totalLabel}>
                                Montant total
                            </Text>

                            <Text style={styles.totalValue}>
                                {montantTotal.toLocaleString("fr-FR")} Ar
                            </Text>
                        </View>

                        <Pressable
                            style={[
                                styles.submitButton,
                                saving && styles.disabledButton,
                            ]}
                            onPress={onSubmit}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={22}
                                        color="#fff"
                                    />

                                    <Text style={styles.submitText}>
                                        {editingAchat
                                            ? "Modifier l'achat"
                                            : "Enregistrer l'achat"}
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
