import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../constants/auth.constants";

export default function TabsLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: "#1B5E20",
                tabBarInactiveTintColor: "#777",

                tabBarStyle: {
                    height: 65,
                    paddingTop: 5,
                    paddingBottom: 8,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",

                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="produits"
                options={{
                    title: "Produits",

                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="cube-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="ventes"
                options={{
                    title: "Ventes",

                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="cart-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="achats"
                options={{
                    title: "Achats",

                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="bag-add-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profil"
                options={{
                    title: "Profil",

                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}