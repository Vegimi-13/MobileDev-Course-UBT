import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Save, X } from "lucide-react-native";
import type { ProfileForm } from "../viewmodels/useProfileViewModel";

type EditProfileSheetProps = {
  visible: boolean;
  form: ProfileForm;
  isSaving: boolean;
  error?: string | null;
  onCancel: () => void;
  onChange: (key: keyof ProfileForm, value: string) => void;
  onSave: () => void;
};

export default function EditProfileSheet({
  visible,
  form,
  isSaving,
  error,
  onCancel,
  onChange,
  onSave,
}: EditProfileSheetProps) {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <ScrollView
          contentContainerStyle={styles.sheetWrap}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>
            <Pressable hitSlop={10} onPress={onCancel} style={styles.iconButton}>
              <X color="#667085" size={22} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={styles.twoColumn}>
            <ProfileInput
              label="First name"
              value={form.firstName}
              onChangeText={(value) => onChange("firstName", value)}
            />
            <ProfileInput
              label="Last name"
              value={form.lastName}
              onChangeText={(value) => onChange("lastName", value)}
            />
          </View>

          <ProfileInput
            autoCapitalize="none"
            label="Username"
            value={form.username}
            onChangeText={(value) => onChange("username", value)}
          />
          <ProfileInput
            label="Bio"
            multiline
            value={form.bio}
            onChangeText={(value) => onChange("bio", value)}
          />
          <ProfileInput
            autoCapitalize="none"
            label="Avatar URL"
            value={form.avatarUrl}
            onChangeText={(value) => onChange("avatarUrl", value)}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            disabled={isSaving}
            onPress={onSave}
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Save color="#FFFFFF" size={18} strokeWidth={2.2} />
                <Text style={styles.saveButtonText}>Save changes</Text>
              </>
            )}
          </Pressable>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type ProfileInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
};

function ProfileInput({
  label,
  value,
  onChangeText,
  autoCapitalize = "words",
  multiline = false,
}: ProfileInputProps) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholderTextColor="#98A2B3"
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(23, 23, 43, 0.35)",
    flex: 1,
  },
  sheetWrap: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF9F3",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    color: "#26233B",
    fontSize: 22,
    fontWeight: "900",
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#F2EAE2",
    borderRadius: 18,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  twoColumn: {
    flexDirection: "row",
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    marginBottom: 14,
  },
  label: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E9E1D9",
    borderRadius: 16,
    borderWidth: 1,
    color: "#26233B",
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  multilineInput: {
    minHeight: 94,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#C2410C",
    fontSize: 13,
    marginBottom: 12,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 54,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
