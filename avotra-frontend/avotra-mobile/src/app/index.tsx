import React from "react";
import { Image, Text, View, ActivityIndicator } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "../constants/auth.constants";
import { useTheme } from "../constants/theme.constants";
import { Pressable } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { styles, colors } = useTheme();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Si déjà connecté, on saute directement au dashboard
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center", padding: 30 },
      ]}
    >
      <Image
        source={require("../../assets/images/LOGO_PRINCIPAL.png")}
        style={{ width: 180, height: 180, marginBottom: 10 }}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.title,
          { fontSize: 26, textAlign: "center", marginTop: 10 },
        ]}
      >
        AVOTRA COMMERCE
      </Text>

      <Text
        style={[
          styles.subtitle,
          { textAlign: "center", marginTop: 10, marginBottom: 50, fontSize: 15 },
        ]}
      >
        Gérez vos achats, ventes et votre stock{"\n"}simplement, où que vous soyez.
      </Text>

      <View
        style={[
          styles.button,
          styles.buttonPrimary,
          { width: "100%" },
        ]}>

        <Pressable
          style={[styles.button, styles.buttonPrimary, { width: "100%" }]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </Pressable>

      </View>
    </View>
  );
}