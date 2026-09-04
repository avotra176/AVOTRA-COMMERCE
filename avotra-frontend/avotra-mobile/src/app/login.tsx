import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../constants/auth.constants";
import { styles, colors } from "../styles/styles.global";

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "L'email et le mot de passe sont obligatoires.");
      return;
    }

    try {
      setLoginLoading(true);
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Erreur login", error.message);
      } else {
        Alert.alert("Erreur login", "Une erreur est survenue.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (

    <KeyboardAvoidingView
      style={[styles.container, { justifyContent: "center", padding: 0 }] as any}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 55, flexGrow: 1, justifyContent: "center" }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { marginBottom: 20 }]}>
          <Image
            source={require("../../assets/images/LOGO_PRINCIPAL.png")}
            style={{ width: 130, height: 130, alignSelf: "center" }}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.card, { padding: 28, borderRadius: 24 }]}>
          <Text style={[styles.title, { fontSize: 22, textAlign: "center", marginTop: 8 }]}>
            AVOTRA COMMERCE
          </Text>

          <Text style={[styles.subtitle, { textAlign: "center", marginTop: 8, marginBottom: 25 }]}>
            Connexion à votre compte
          </Text>

          <TextInput
            style={[styles.input, { marginBottom: 15 }]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, { marginBottom: 15 }]}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, { marginTop: 5 }]}
            onPress={handleLogin}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={[styles.card, { padding: 28, borderRadius: 24, marginTop: 10 }]}>
          <Text style={[styles.subtitle, { textAlign: "center", marginTop: 8 }]}>
            Vous n'avez pas de compte ? Contactez l'administrateur pour en créer un.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}