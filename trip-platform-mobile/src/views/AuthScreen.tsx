import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { AuthForm, AuthMode } from "../models/auth";

type AuthScreenProps = {
  apiUrl: string;
  canSubmit: boolean;
  form: AuthForm;
  isLoading: boolean;
  message: string;
  mode: AuthMode;
  copy: {
    title: string;
    subtitle: string;
    buttonTitle: string;
  };
  onSubmit: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onUpdateForm: (key: keyof AuthForm, value: string) => void;
};

export function AuthScreen({
  apiUrl,
  canSubmit,
  copy,
  form,
  isLoading,
  message,
  mode,
  onSubmit,
  onSwitchMode,
  onUpdateForm,
}: AuthScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>TP</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Trip Platform</Text>
              <Text style={styles.brandTagline}>Travel starts here</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.segmentedControl}>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.segment,
                  mode === "login" && styles.segmentActive,
                ]}
                onPress={() => onSwitchMode("login")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    mode === "login" && styles.segmentTextActive,
                  ]}
                >
                  Login
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.segment,
                  mode === "register" && styles.segmentActive,
                ]}
                onPress={() => onSwitchMode("register")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    mode === "register" && styles.segmentTextActive,
                  ]}
                >
                  Register
                </Text>
              </Pressable>
            </View>

            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>

            {mode === "register" && (
              <View style={styles.nameRow}>
                <View style={styles.nameInputWrap}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput
                    autoCapitalize="words"
                    onChangeText={(value) => onUpdateForm("firstName", value)}
                    placeholder="Arta"
                    placeholderTextColor="#8F96A6"
                    style={styles.input}
                    value={form.firstName}
                  />
                </View>
                <View style={styles.nameInputWrap}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput
                    autoCapitalize="words"
                    onChangeText={(value) => onUpdateForm("lastName", value)}
                    placeholder="Krasniqi"
                    placeholderTextColor="#8F96A6"
                    style={styles.input}
                    value={form.lastName}
                  />
                </View>
              </View>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={(value) => onUpdateForm("email", value)}
              placeholder="you@example.com"
              placeholderTextColor="#8F96A6"
              style={styles.input}
              textContentType="emailAddress"
              value={form.email}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              autoCapitalize="none"
              onChangeText={(value) => onUpdateForm("password", value)}
              placeholder={mode === "login" ? "Your password" : "6+ characters"}
              placeholderTextColor="#8F96A6"
              secureTextEntry
              style={styles.input}
              textContentType={mode === "login" ? "password" : "newPassword"}
              value={form.password}
            />

            {message.length > 0 && (
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={!canSubmit || isLoading}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.primaryButton,
                (!canSubmit || isLoading) && styles.primaryButtonDisabled,
                pressed && canSubmit && !isLoading && styles.primaryButtonPressed,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fffaf4" />
              ) : (
                <Text style={styles.primaryButtonText}>{copy.buttonTitle}</Text>
              )}
            </Pressable>

            <Text style={styles.apiText}>Backend: {apiUrl}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBF4EC",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginBottom: 28,
  },
  logo: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 18,
    height: 56,
    justifyContent: "center",
    shadowColor: "#2C2117",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    width: 56,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  brandName: {
    color: "#17172B",
    fontSize: 25,
    fontWeight: "900",
  },
  brandTagline: {
    color: "#667085",
    fontSize: 14,
    marginTop: 2,
  },
  panel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EDE4DB",
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowColor: "#2C2117",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
  },
  segmentedControl: {
    backgroundColor: "#EEE6DE",
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 26,
    padding: 4,
  },
  segment: {
    alignItems: "center",
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#271B14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  segmentText: {
    color: "#98A2B3",
    fontSize: 15,
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#17172B",
  },
  title: {
    color: "#17172B",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameInputWrap: {
    flex: 1,
  },
  label: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FBF4EC",
    borderColor: "#E7E1DC",
    borderRadius: 14,
    borderWidth: 1,
    color: "#17172B",
    fontSize: 16,
    marginBottom: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  messageBox: {
    backgroundColor: "#FFF0EA",
    borderColor: "#FFD8C9",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  messageText: {
    color: "#C2410C",
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 54,
    shadowColor: "#2C2117",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  primaryButtonPressed: {
    backgroundColor: "#F26A2E",
  },
  primaryButtonDisabled: {
    backgroundColor: "#F2C5B4",
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  apiText: {
    color: "#98A2B3",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
    textAlign: "center",
  },
});
