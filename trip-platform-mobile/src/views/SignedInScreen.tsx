import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

type SignedInScreenProps = {
  apiUrl: string;
  onLogout: () => void;
};

export function SignedInScreen({ apiUrl, onLogout }: SignedInScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.successShell}>
        <View style={styles.successBadge}>
          <Text style={styles.successBadgeText}>TP</Text>
        </View>
        <Text style={styles.successTitle}>You are signed in</Text>
        <Text style={styles.successText}>
          Your access and refresh tokens are stored securely on this device.
        </Text>
        <Text style={styles.apiText}>Connected to {apiUrl}</Text>
        <Pressable style={styles.secondaryButton} onPress={onLogout}>
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff7ef",
  },
  successShell: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },
  successBadge: {
    alignItems: "center",
    backgroundColor: "#b85f2b",
    borderRadius: 24,
    height: 76,
    justifyContent: "center",
    marginBottom: 24,
    width: 76,
  },
  successBadgeText: {
    color: "#fffaf4",
    fontSize: 22,
    fontWeight: "900",
  },
  successTitle: {
    color: "#2c201b",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },
  successText: {
    color: "#765e52",
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 320,
    textAlign: "center",
  },
  apiText: {
    color: "#8b7163",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
    textAlign: "center",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#b85f2b",
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 26,
    minHeight: 50,
    minWidth: 140,
  },
  secondaryButtonText: {
    color: "#9e4e22",
    fontSize: 15,
    fontWeight: "800",
  },
});
