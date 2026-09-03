import React, { useState } from "react";
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
import { Vente, FormState } from "@/types/vente.types";
import { Produit } from "@/types/produit.types";
import { styles } from "@/styles/styles.global";
import ProduitPicker from "@/components/ui/ProduitPicker";

interface Props {
    visible: boolean;
    editingVente: Vente | null;
    form: FormState;
    produits: Produit[];
    montantTotal: number;
    saving: boolean;
    onClose: () => void;
    onSubmit: () => void;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

export default function VenteFormModal({
    visible,
    editingVente,
    form,
    produits,
    montantTotal,
    saving,
    onClose,
    onSubmit,
    setForm,
}: Props) {
    const [produitPickerVisible, setProduitPickerVisible] = useState(false);

    const selectedProduit = produits.find(
        (p) => p.id === form.produit_id
    );

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
                            {editingVente ? "Modifier la vente" : "Nouvelle vente"}
                        </Text>

                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={28} />
                        </Pressable>
                    </View>

                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={styles.label}>Produit</Text>

                        <Pressable
                            style={styles.input}
                            onPress={() => setProduitPickerVisible(true)}
                        >
                            <Text style={{ color: selectedProduit ? "#000" : "#999" }}>
                                {selectedProduit
                                    ? `${selectedProduit.nom} (Stock : ${selectedProduit.stock})`
                                    : "Sélectionner un produit"}
                            </Text>
                        </Pressable>

                        <Text style={styles.label}>Quantité</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ex : 5"
                            keyboardType="numeric"
                            value={form.quantite}
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, quantite: text }))
                            }
                        />

                        {selectedProduit && Number(form.quantite) > selectedProduit.stock && (
                            <Text style={{ color: "#DC2626", marginTop: -8, marginBottom: 12, fontSize: 13 }}>
                                Quantité supérieure au stock disponible ({selectedProduit.stock})
                            </Text>
                        )}

                        <Text style={styles.label}>Prix unitaire</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ex : 20000"
                            keyboardType="numeric"
                            value={form.prix_unitaire}
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, prix_unitaire: text }))
                            }
                        />

                        <View style={styles.totalBox}>
                            <Text style={styles.totalLabel}>Montant total</Text>
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
                                        {editingVente ? "Modifier la vente" : "Enregistrer la vente"}
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

            <ProduitPicker
                visible={produitPickerVisible}
                produits={produits}
                selectedId={form.produit_id}
                onClose={() => setProduitPickerVisible(false)}
                onSelect={(p) => {
                    setForm((prev) => ({
                        ...prev,
                        produit_id: p.id,
                        prix_unitaire: String(p.prix_vente), // pré-remplit avec le prix de vente par défaut
                    }));
                }}
            />
        </Modal>
    );
}