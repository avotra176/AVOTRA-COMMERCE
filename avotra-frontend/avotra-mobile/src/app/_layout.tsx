import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../constants/auth.constants';
import { ThemeProvider } from '../constants/theme.constants';


export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="login" />
                        <Stack.Screen name="(tabs)" />
                    </Stack>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    )
}




