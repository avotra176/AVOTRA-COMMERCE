import { StyleSheet } from 'react-native';

// COLORS
export const colors = {
    // Couleur principale : vert profond "registre comptable"
    primary: "#1C4B3A",
    primarySoft: "#E4EEE8",
    primaryDark: "#123328",

    // Accent laiton — réservé aux moments forts (ex: CA du dashboard)
    accent: "#BD8A3F",
    accentSoft: "#F3E7D2",
    highlight: "#CDE3D6",

    background: "#F2F4F0",
    surface: "#FFFFFF",
    surfaceAlt: "#EAF0EA",
    surfaceSunken: "#E9EDE7",

    text: "#141B16",
    textSecondary: "#5B665C",
    textLight: "#8B978D",

    border: "#DDE3DA",

    success: "#2F7D52",
    danger: "#B3261E",
    dangerSoft: "#F7DEDB",
    warning: "#C08A3E",

    black: "#141B16",
    white: "#FFFFFF",
    muted: "#F3F5F1",
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
};

export const raduis = {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 26,
    round: 999,
};

// STYLES
export const styles = StyleSheet.create({
    // CONTENEURS
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.text,
        letterSpacing: -0.8,
        fontFamily: "System",
    },
    subtitle: {
        marginTop: spacing.xs,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 19,
    },

    // bouton ajouter
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        minWidth: 146,
        height: 46,
        paddingHorizontal: spacing.lg,
        borderRadius: 14,
        shadowColor: colors.primaryDark,
        shadowOpacity: 0.22,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    plus: {
        fontSize: 22,
        fontWeight: "600",
        color: colors.white,
        marginRight: spacing.xs,
        lineHeight: 22,
    },
    addText: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.white,
        letterSpacing: 0.2,
        fontFamily: "System",
    },

    // boutons
    button: {
        height: 54,
        borderRadius: raduis.md,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
        shadowColor: colors.primaryDark,
        shadowOpacity: 0.16,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
    },
    buttonDanger: {
        backgroundColor: colors.danger,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.white,
        letterSpacing: 0.2,
        fontFamily: "System",
    },

    // cartes
    card: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOpacity: 0.05,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
    },

    // inputs
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: raduis.md,
        paddingHorizontal: spacing.md,
        fontSize: 16,
        color: colors.text,
        backgroundColor: colors.surface,
        shadowColor: colors.black,
        shadowOpacity: 0.02,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
        marginBottom: spacing.sm,
    },

    // Listes
    listItem: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        padding: spacing.lg,
        marginBottom: spacing.md,
        shadowColor: colors.black,
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        fontFamily: "System",
    },
    listText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 5,
        fontFamily: "System",
    },

    // Etats
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    empty: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: "center",
    },

    containerSearch: {
        height: 48,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },

    textarea: {
        height: 95,
        paddingTop: 12,
    },
    categories: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    loadingCategories: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
    },
    loadingText: {
        marginTop: 10,
        color: colors.textSecondary,
        fontSize: 14,
    },
    emptyCategories: {
        color: colors.textSecondary,
        fontSize: 13,
        paddingVertical: 8,
    },
    category: {
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    categorySelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    categoryText: {
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: "600",
    },
    categoryTextSelected: {
        color: colors.white,
    },
    saveButton: {
        height: 52,
        marginTop: 24,
        marginBottom: 20,
        borderRadius: 14,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        shadowColor: colors.primaryDark,
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    disabled: {
        opacity: 0.6,
    },
    saveText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700",
    },

    addButtonDisabled: {
        opacity: 0.7,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        marginHorizontal: 20,
        marginBottom: 15,
        paddingHorizontal: 14,
        borderRadius: 12,
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOpacity: 0.02,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 16,
        color: colors.text,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    achatTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },
    achatId: {
        color: colors.textSecondary,
        marginTop: 3,
    },
    total: {
        fontSize: 17,
        fontWeight: "800",
        color: colors.text,
        letterSpacing: -0.3,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    infoText: {
        marginLeft: 7,
        fontSize: 14,
        color: colors.textSecondary,
    },
    price: {
        marginTop: 12,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    editButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 11,
        borderRadius: 12,
        backgroundColor: colors.muted,
        gap: 6,
    },
    deleteButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 11,
        borderRadius: 12,
        backgroundColor: colors.dangerSoft,
        gap: 6,
    },
    text: {
        marginTop: 5,
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
    },
    deleteText: {
        fontWeight: "600",
        color: colors.danger,
    },

    emptyContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 15,
        color: colors.text,
    },
    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: colors.primaryDark,
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    emptyButtonText: {
        color: colors.white,
        fontWeight: "600",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(20, 27, 22, 0.55)",
        justifyContent: "flex-end",
    },
    modal: {
        maxHeight: "92%",
        backgroundColor: colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 20,
        shadowColor: colors.black,
        shadowOpacity: 0.14,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -8 },
        elevation: 8,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: colors.text,
        letterSpacing: -0.4,
    },

    horizontalList: {
        marginBottom: 5,
    },
    choice: {
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        marginRight: 8,
        backgroundColor: colors.surface,
    },
    choiceSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    choiceText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    choiceTextSelected: {
        color: colors.white,
        fontWeight: "600",
    },

    totalBox: {
        marginTop: 20,
        padding: 15,
        borderRadius: 16,
        backgroundColor: colors.surfaceAlt,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary,
        letterSpacing: -0.3,
    },
    submitButton: {
        height: 52,
        backgroundColor: colors.primary,
        borderRadius: 14,
        marginTop: 20,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        shadowColor: colors.primaryDark,
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700",
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primarySoft,
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.text,
    },
    unit: {
        marginTop: 3,
        fontSize: 13,
        color: colors.textSecondary,
    },
    actions: {
        flexDirection: "row",
    },
    action: {
        padding: 8,
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 13,
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(20, 27, 22, 0.55)",
    },
    details: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 3,
    },
    value: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
    },
    stockZero: {
        color: colors.danger,
    },
});