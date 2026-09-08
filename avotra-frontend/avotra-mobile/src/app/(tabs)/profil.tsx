import {
    Alert,
    Text,
    TouchableOpacity,
    ScrollView,
    View,
    Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../constants/auth.constants";
import { useTheme } from "../../constants/theme.constants";
import AppHeader from '../../components/ui/AppHeader';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    danger?: boolean;
    rightElement?: React.ReactNode;
}

export default function ProfilScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { styles, colors, isDark, toggleTheme } = useTheme();

    const MenuItem = ({ icon, label, onPress, danger, rightElement }: MenuItemProps) => (
        <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14 }}
            onPress={onPress}
            disabled={!onPress}
        >
            <View
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: danger ? colors.dangerSoft : colors.primarySoft,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 14,
                }}
            >
                <Ionicons name={icon} size={19} color={danger ? colors.danger : colors.primary} />
            </View>

            <Text style={{ flex: 1, fontSize: 15, fontWeight: "500", color: danger ? colors.danger : colors.text }}>
                {label}
            </Text>

            {rightElement ?? (onPress && <Ionicons name="chevron-forward" size={18} color={colors.textLight} />)}
        </TouchableOpacity>
    );

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Voulez-vous vraiment vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
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

    const initiale = (user?.nom || user?.email || "?").charAt(0).toUpperCase();

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingTop: 55, flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
        >
            <AppHeader title="Profil" />

            <View style={[styles.card, { alignItems: "center", paddingVertical: 30 }]}>
                <View
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        backgroundColor: colors.primarySoft,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ fontSize: 28, fontWeight: "700", color: colors.primary }}>
                        {initiale}
                    </Text>
                </View>

                <Text style={[styles.name, { fontSize: 19 }]}>{user?.nom || "Utilisateur"}</Text>
                <Text style={[styles.listText, { marginTop: 4 }]}>{user?.email}</Text>

                {user?.role && (
                    <View
                        style={{
                            marginTop: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 999,
                            backgroundColor: colors.accentSoft,
                        }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.accent }}>
                            {user.role}
                        </Text>
                    </View>
                )}
            </View>

            <Text style={[styles.label, { marginTop: 25, marginBottom: 5, marginLeft: 4 }]}>Compte</Text>

            <View style={[styles.card, { paddingVertical: 6 }]}>
                <MenuItem
                    icon="key-outline"
                    label="Changer le mot de passe"
                    onPress={() => router.push("/change-password" as any)}
                />
                <View style={styles.separator} />
                <MenuItem
                    icon="receipt-outline"
                    label="Mes dépenses personnelles"
                    onPress={() => router.push("/mes-depenses")}
                />
                {user?.role === "admin" && (
                    <>
                        <View style={styles.separator} />
                        <MenuItem
                            icon="person-add-outline"
                            label="Créer un compte"
                            onPress={() => router.push("/register" as any)}
                        />
                    </>
                )}
            </View>

            <Text style={[styles.label, { marginTop: 20, marginBottom: 5, marginLeft: 4 }]}>Préférences</Text>

            <View style={[styles.card, { paddingVertical: 6 }]}>
                <MenuItem
                    icon={isDark ? "moon" : "moon-outline"}
                    label="Mode sombre"
                    rightElement={
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    }
                />
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    styles.buttonDanger,
                    { marginTop: 25, flexDirection: "row", justifyContent: "center", alignItems: "center" },
                ]}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Se déconnecter</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}