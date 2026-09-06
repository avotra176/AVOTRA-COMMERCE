import React, { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme.constants";

interface AppHeaderProps {
    title: string;
    subtitle?: string;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    onLeftPress?: () => void;
    children?: ReactNode; // pour insérer des onglets/recherche à l'intérieur du bloc sombre
}

export default function AppHeader({
    title,
    subtitle,
    rightIcon,
    onRightPress,
    leftIcon,
    onLeftPress,
    children,
}: AppHeaderProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.primaryDark,
                paddingTop: 55,
                paddingHorizontal: 22,
                paddingBottom: children ? 20 : 28,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {leftIcon && (
                    <Pressable onPress={onLeftPress} style={{ marginRight: 12 }}>
                        <Ionicons name={leftIcon} size={22} color={colors.white} />
                    </Pressable>
                )}

                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: "800", color: colors.white }}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                            {subtitle}
                        </Text>
                    )}
                </View>

                {rightIcon && (
                    <Pressable onPress={onRightPress}>
                        <Ionicons name={rightIcon} size={22} color={colors.white} />
                    </Pressable>
                )}
            </View>

            {children && <View style={{ marginTop: 18 }}>{children}</View>}
        </View>
    );
}