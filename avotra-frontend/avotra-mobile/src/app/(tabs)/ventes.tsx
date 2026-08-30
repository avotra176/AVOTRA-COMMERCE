import { View, Text } from "react-native";
import { styles } from "../../styles/styles.global";

export default function Ventes() {
    return (
        <View style={[styles.container, { padding: 20 }]}>
            <Text style={[styles.title, { marginBottom: 20 }]}>Ventes</Text>

            <View style={styles.card}>
                <Text style={[styles.label, { color: "#64748B", fontSize: 15 }]}>Total des ventes</Text>
                <Text style={[styles.total, { marginTop: 8, fontSize: 28 }]}>0 Ar</Text>
            </View>

            <View style={styles.card}>
                <Text style={[styles.text, { textAlign: "center" }]}>
                    Aucune vente enregistrée
                </Text>
            </View>
        </View>
    );
}