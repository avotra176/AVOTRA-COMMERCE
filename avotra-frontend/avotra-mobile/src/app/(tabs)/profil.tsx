import {
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useRouter } from "expo-router";
import { useAuth } from "../../constants/auth.constants";
import { styles } from "../../styles/styles.global";

export default function ProfilScreen() {
    const router = useRouter();

    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Voulez-vous vraiment vous déconnecter ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Déconnexion",
                    style: "destructive",

                    onPress: async () => {
                        await logout();

                        router.replace("/login");
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { justifyContent: "center", alignItems: "center", padding: 25 }]}>
            <Text style={[styles.title, { marginBottom: 20 }]}>
                Profil
            </Text>

            <Text style={[styles.listText, { fontSize: 17, marginBottom: 10 }]}>
                {user?.email}
            </Text>

            {user?.nom && (
                <Text style={[styles.listText, { marginBottom: 5 }]}>
                    {user.nom}
                </Text>
            )}

            {user?.role && (
                <Text style={[styles.listText, { marginBottom: 5 }]}>
                    Rôle : {user.role}
                </Text>
            )}

            <TouchableOpacity
                style={[styles.button, styles.buttonDanger, { marginTop: 40, minWidth: 220 }]}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>
                    Se déconnecter
                </Text>
            </TouchableOpacity>
        </View>
    );
}
