import { ScrollView, Text, View } from "react-native";
import { useAuth } from "../../constants/auth.constants";
import { styles } from "../../styles/styles.global";

export default function HomeScreen() {
    const { user } = useAuth();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingTop: 55 }]}
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

            <View style={{ gap: 15 }}>
                <View style={styles.card}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Chiffre d'affaires
                    </Text>

                    <Text style={[styles.total, { marginTop: 8, fontSize: 25 }]}>
                        0 Ar
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Ventes
                    </Text>

                    <Text style={[styles.total, { marginTop: 8, fontSize: 25 }]}>
                        0
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Produits
                    </Text>

                    <Text style={[styles.total, { marginTop: 8, fontSize: 25 }]}>
                        0
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={{ fontSize: 15, color: "#64748B" }}>
                        Stock
                    </Text>

                    <Text style={[styles.total, { marginTop: 8, fontSize: 25 }]}>
                        0
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}