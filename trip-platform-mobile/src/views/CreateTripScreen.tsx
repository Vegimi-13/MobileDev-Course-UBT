import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Globe2,
  Lock,
  MapPin,
  Minus,
  Plus,
  Users,
} from "lucide-react-native";
import {
  categoryOptions,
  coverOptions,
  tagOptions,
  useCreateTripViewModel,
} from "../viewmodels/useCreateTripViewModel";

type CreateTripScreenProps = {
  onDone: () => void;
  onExplore: () => void;
};

type DateFieldKey = "startDate" | "endDate";

export function CreateTripScreen({ onDone, onExplore }: CreateTripScreenProps) {
  const vm = useCreateTripViewModel(onDone);
  const [activeDateField, setActiveDateField] = useState<DateFieldKey | null>(null);

  const selectDate = (value: string) => {
    if (!activeDateField) return;

    vm.updateField(activeDateField, value);
    if (activeDateField === "startDate" && vm.form.endDate && vm.form.endDate < value) {
      vm.updateField("endDate", value);
    }
    setActiveDateField(null);
  };

  if (vm.step === 4) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successWrap}>
          <View style={styles.successBadge}>
            <Check color="#FFFFFF" size={42} strokeWidth={3} />
          </View>
          <Text style={styles.successTitle}>Trip Created!</Text>
          <Text style={styles.successText}>
            Your trip {vm.form.title} is live. Start inviting your crew.
          </Text>
          <Pressable style={styles.primaryButton} onPress={vm.resetAndGo}>
            <Text style={styles.primaryButtonText}>View My Trips</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onExplore}>
            <Text style={styles.secondaryButtonText}>Explore More Trips</Text>
          </Pressable>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={vm.back}>
          <ArrowLeft color="#17172B" size={23} strokeWidth={2.2} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.stepLabel}>Step {vm.step} of 3</Text>
          <Text style={styles.title}>
            {vm.step === 1
              ? "Plan Your Trip"
              : vm.step === 2
                ? "Trip Settings"
                : "Choose Cover"}
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.progressSegment,
              item <= vm.step && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {vm.step === 1 && (
          <>
            <FieldLabel label="Trip title *" />
            <TextInput
              onChangeText={(value) => vm.updateField("title", value)}
              placeholder="e.g. Bali Escape"
              placeholderTextColor="#8F96A6"
              style={styles.input}
              value={vm.form.title}
            />
            <FieldLabel label="Destination *" />
            <View style={styles.iconInput}>
              <MapPin color="#98A2B3" size={21} strokeWidth={2} />
              <TextInput
                onChangeText={(value) => vm.updateField("destination", value)}
                placeholder="e.g. Bali, Indonesia"
                placeholderTextColor="#8F96A6"
                style={styles.iconTextInput}
                value={vm.form.destination}
              />
            </View>
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <FieldLabel label="Start date *" />
                <DateInput
                  value={vm.form.startDate}
                  placeholder="Select start"
                  onPress={() => setActiveDateField("startDate")}
                />
              </View>
              <View style={styles.dateField}>
                <FieldLabel label="End date *" />
                <DateInput
                  value={vm.form.endDate}
                  placeholder="Select end"
                  onPress={() => setActiveDateField("endDate")}
                />
              </View>
            </View>
            <FieldLabel label="Description" />
            <TextInput
              multiline
              onChangeText={(value) => vm.updateField("description", value)}
              placeholder="Tell people what this trip is about..."
              placeholderTextColor="#8F96A6"
              style={[styles.input, styles.textArea]}
              value={vm.form.description}
            />
          </>
        )}

        {vm.step === 2 && (
          <>
            <SettingsBlock title="Visibility">
              <OptionCard
                active={vm.form.visibility === "PUBLIC"}
                icon={<Globe2 color={vm.form.visibility === "PUBLIC" ? "#00C989" : "#98A2B3"} />}
                label="Public"
                subtitle="Anyone can find it"
                onPress={() => vm.updateField("visibility", "PUBLIC")}
              />
              <OptionCard
                active={vm.form.visibility === "PRIVATE"}
                icon={<Lock color={vm.form.visibility === "PRIVATE" ? "#00C989" : "#98A2B3"} />}
                label="Private"
                subtitle="Invite only"
                onPress={() => vm.updateField("visibility", "PRIVATE")}
              />
            </SettingsBlock>

            <SettingsBlock title="Join Policy" tone="orange">
              <OptionCard
                active={vm.form.joinPolicy === "OPEN"}
                label="Open"
                subtitle="Anyone can join"
                onPress={() => vm.updateField("joinPolicy", "OPEN")}
              />
              <OptionCard
                active={vm.form.joinPolicy === "APPROVAL"}
                label="Closed"
                subtitle="You approve members"
                onPress={() => vm.updateField("joinPolicy", "APPROVAL")}
              />
            </SettingsBlock>

            <View style={styles.membersCard}>
              <Text style={styles.membersTitle}>Max Members</Text>
              <View style={styles.memberControls}>
                <Pressable
                  style={styles.roundControl}
                  onPress={() =>
                    vm.updateField("maxMembers", Math.max(vm.form.maxMembers - 1, 1))
                  }
                >
                  <Minus color="#667085" size={20} />
                </Pressable>
                <Users color="#FF6535" size={20} />
                <Text style={styles.memberCount}>{vm.form.maxMembers}</Text>
                <Pressable
                  style={[styles.roundControl, styles.roundControlActive]}
                  onPress={() =>
                    vm.updateField("maxMembers", vm.form.maxMembers + 1)
                  }
                >
                  <Plus color="#FFFFFF" size={20} />
                </Pressable>
              </View>
            </View>

            <FieldLabel label="Category *" />
            <View style={styles.choiceGrid}>
              {categoryOptions.map((category) => (
                <ChipButton
                  key={category}
                  label={category}
                  active={vm.form.categoryName === category}
                  onPress={() => vm.updateField("categoryName", category)}
                />
              ))}
            </View>

            <FieldLabel label="Tags (optional)" />
            <View style={styles.tagRow}>
              {tagOptions.map((tag) => (
                <ChipButton
                  key={tag}
                  label={`#${tag}`}
                  active={vm.form.tags.includes(tag)}
                  onPress={() => vm.toggleTag(tag)}
                />
              ))}
            </View>
          </>
        )}

        {vm.step === 3 && (
          <>
            <Text style={styles.coverHint}>Pick a cover photo that matches your vibe</Text>
            <View style={styles.coverPreview}>
              <Image source={{ uri: vm.form.coverImageUrl }} style={styles.coverPreviewImage} />
              <View style={styles.coverOverlay} />
              <Text style={styles.coverTitle}>{vm.form.title || "Your trip"}</Text>
              <Text style={styles.coverSubtitle}>
                {vm.form.destination || "Destination"}
              </Text>
            </View>
            <View style={styles.coverGrid}>
              {coverOptions.map((cover) => (
                <Pressable
                  key={cover.label}
                  onPress={() => vm.updateField("coverImageUrl", cover.url)}
                  style={[
                    styles.coverOption,
                    vm.form.coverImageUrl === cover.url && styles.coverOptionActive,
                  ]}
                >
                  <Image source={{ uri: cover.url }} style={styles.coverOptionImage} />
                  <View style={styles.coverOverlay} />
                  <Text style={styles.coverOptionText}>{cover.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {vm.error ? <Text style={styles.errorText}>{vm.error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={!vm.canContinue || vm.isSubmitting}
          onPress={vm.next}
          style={[
            styles.continueButton,
            vm.canContinue && styles.continueButtonActive,
          ]}
        >
          {vm.isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text
                style={[
                  styles.continueButtonText,
                  vm.canContinue && styles.continueButtonTextActive,
                ]}
              >
                {vm.step === 3 ? "Create Trip" : "Continue"}
              </Text>
              <ArrowRight
                color={vm.canContinue ? "#FFFFFF" : "#B8BEC9"}
                size={20}
                strokeWidth={2.2}
              />
            </>
          )}
        </Pressable>
      </View>
      <TripCalendarModal
        minValue={activeDateField === "endDate" ? vm.form.startDate : undefined}
        selectedValue={activeDateField ? vm.form[activeDateField] : ""}
        visible={activeDateField !== null}
        onClose={() => setActiveDateField(null)}
        onSelect={selectDate}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={styles.label}>{label}</Text>;
}

function DateInput({
  placeholder,
  onPress,
  value,
}: {
  placeholder: string;
  onPress: () => void;
  value: string;
}) {
  return (
    <Pressable style={styles.iconInput} onPress={onPress}>
      <Calendar color="#98A2B3" size={20} strokeWidth={2} />
      <Text style={[styles.dateText, !value && styles.datePlaceholder]}>
        {value ? formatDateLabel(value) : placeholder}
      </Text>
    </Pressable>
  );
}

function TripCalendarModal({
  minValue,
  onClose,
  onSelect,
  selectedValue,
  visible,
}: {
  minValue?: string;
  onClose: () => void;
  onSelect: (value: string) => void;
  selectedValue: string;
  visible: boolean;
}) {
  const initialDate = selectedValue ? parseDateKey(selectedValue) : new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  useEffect(() => {
    if (!visible) return;
    const date = selectedValue ? parseDateKey(selectedValue) : new Date();
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, [selectedValue, visible]);

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        return toDateKey(new Date(year, month, day));
      }),
    ];
  }, [visibleMonth]);

  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  const moveMonth = (offset: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.calendarSheet}>
          <View style={styles.calendarHeader}>
            <Pressable style={styles.monthButton} onPress={() => moveMonth(-1)}>
              <ChevronLeft color="#17172B" size={20} strokeWidth={2.4} />
            </Pressable>
            <Text style={styles.calendarTitle}>{monthLabel}</Text>
            <Pressable style={styles.monthButton} onPress={() => moveMonth(1)}>
              <ChevronRight color="#17172B" size={20} strokeWidth={2.4} />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.dayGrid}>
            {days.map((dateKey, index) => {
              const isDisabled = Boolean(dateKey && minValue && dateKey < minValue);
              const isSelected = dateKey === selectedValue;

              return dateKey ? (
                <Pressable
                  key={dateKey}
                  disabled={isDisabled}
                  onPress={() => onSelect(dateKey)}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isDisabled && styles.dayCellDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      isDisabled && styles.dayTextDisabled,
                    ]}
                  >
                    {Number(dateKey.slice(-2))}
                  </Text>
                </Pressable>
              ) : (
                <View key={`blank-${index}`} style={styles.dayCell} />
              );
            })}
          </View>

          <Pressable style={styles.closeCalendarButton} onPress={onClose}>
            <Text style={styles.closeCalendarText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function SettingsBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
  tone?: "orange";
}) {
  return (
    <View style={styles.settingsBlock}>
      <Text style={styles.settingsTitle}>{title}</Text>
      <View style={styles.optionsRow}>{children}</View>
    </View>
  );
}

function OptionCard({
  active,
  icon,
  label,
  onPress,
  subtitle,
}: {
  active: boolean;
  icon?: React.ReactNode;
  label: string;
  onPress: () => void;
  subtitle: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionCard, active && styles.optionCardActive]}
    >
      {icon}
      <Text style={[styles.optionTitle, active && styles.optionTitleActive]}>
        {label}
      </Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

function ChipButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choiceChip, active && styles.choiceChipActive]}
    >
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateLabel = (value: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDateKey(value));

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FBF4EC" },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#EEE5DC",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 18,
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#F8F3F0",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  headerText: { flex: 1 },
  stepLabel: { color: "#98A2B3", fontSize: 15, fontWeight: "800" },
  title: { color: "#17172B", fontSize: 26, fontWeight: "900", marginTop: 4 },
  progressRow: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    gap: 8,
    paddingBottom: 22,
    paddingHorizontal: 18,
  },
  progressSegment: {
    backgroundColor: "#EEEAE6",
    borderRadius: 999,
    flex: 1,
    height: 7,
  },
  progressSegmentActive: { backgroundColor: "#FF6535" },
  content: { padding: 18, paddingBottom: 130 },
  label: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 18,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7E1DC",
    borderRadius: 18,
    borderWidth: 1,
    color: "#17172B",
    fontSize: 17,
    minHeight: 64,
    paddingHorizontal: 20,
  },
  iconInput: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E7E1DC",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 64,
    paddingHorizontal: 18,
  },
  iconTextInput: { color: "#17172B", flex: 1, fontSize: 17, marginLeft: 12 },
  dateText: {
    color: "#17172B",
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 12,
  },
  datePlaceholder: {
    color: "#8F96A6",
    fontWeight: "700",
  },
  dateRow: { flexDirection: "row", gap: 14 },
  dateField: { flex: 1 },
  textArea: { minHeight: 150, paddingTop: 18, textAlignVertical: "top" },
  settingsBlock: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7E1DC",
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 26,
    padding: 20,
  },
  settingsTitle: {
    color: "#17172B",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 18,
  },
  optionsRow: { flexDirection: "row", gap: 16 },
  optionCard: {
    alignItems: "center",
    borderColor: "#E7E1DC",
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 120,
    justifyContent: "center",
    padding: 12,
  },
  optionCardActive: { backgroundColor: "#E7FBF2", borderColor: "#00C989" },
  optionTitle: {
    color: "#98A2B3",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },
  optionTitleActive: { color: "#00C989" },
  optionSubtitle: {
    color: "#98A2B3",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  membersCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E7E1DC",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    minHeight: 102,
    paddingHorizontal: 22,
  },
  membersTitle: { color: "#17172B", fontSize: 18, fontWeight: "900" },
  memberControls: { alignItems: "center", flexDirection: "row", gap: 16 },
  roundControl: {
    alignItems: "center",
    backgroundColor: "#EEEAE6",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  roundControlActive: { backgroundColor: "#FF6535" },
  memberCount: { color: "#17172B", fontSize: 22, fontWeight: "900" },
  choiceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  choiceChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7E1DC",
    borderRadius: 16,
    borderWidth: 1,
    minWidth: "22%",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  choiceChipActive: { backgroundColor: "#FF6535", borderColor: "#FF6535" },
  choiceText: { color: "#667085", fontSize: 13, fontWeight: "900", textAlign: "center" },
  choiceTextActive: { color: "#FFFFFF" },
  coverHint: { color: "#667085", fontSize: 17, marginBottom: 22 },
  coverPreview: { borderRadius: 20, height: 210, overflow: "hidden" },
  coverPreviewImage: { height: "100%", width: "100%" },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(12,10,20,0.24)" },
  coverTitle: {
    bottom: 48,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    left: 20,
    position: "absolute",
  },
  coverSubtitle: { bottom: 24, color: "#FFFFFF", fontSize: 15, left: 20, position: "absolute" },
  coverGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 24 },
  coverOption: { borderRadius: 14, height: 96, overflow: "hidden", width: "31%" },
  coverOptionActive: { borderColor: "#FF6535", borderWidth: 4 },
  coverOptionImage: { height: "100%", width: "100%" },
  coverOptionText: {
    bottom: 10,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    left: 0,
    position: "absolute",
    right: 0,
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#FBF4EC",
    bottom: 0,
    left: 0,
    padding: 18,
    position: "absolute",
    right: 0,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#EEEAE6",
    borderRadius: 20,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 66,
  },
  continueButtonActive: { backgroundColor: "#FF6535" },
  continueButtonText: { color: "#B8BEC9", fontSize: 18, fontWeight: "900" },
  continueButtonTextActive: { color: "#FFFFFF" },
  errorText: { color: "#C2410C", fontSize: 14, marginTop: 18, textAlign: "center" },
  successWrap: { flex: 1, justifyContent: "center", padding: 24 },
  successBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#12CFA0",
    borderRadius: 64,
    height: 128,
    justifyContent: "center",
    width: 128,
  },
  successTitle: {
    color: "#17172B",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 34,
    textAlign: "center",
  },
  successText: {
    color: "#98A2B3",
    fontSize: 17,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 18,
    marginTop: 42,
    minHeight: 64,
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#EEEAE6",
    borderRadius: 18,
    marginTop: 16,
    minHeight: 64,
    justifyContent: "center",
  },
  secondaryButtonText: { color: "#667085", fontSize: 17, fontWeight: "900" },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(23, 23, 43, 0.42)",
    flex: 1,
    justifyContent: "center",
    padding: 18,
  },
  calendarSheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    width: "100%",
  },
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  calendarTitle: {
    color: "#17172B",
    fontSize: 19,
    fontWeight: "900",
  },
  monthButton: {
    alignItems: "center",
    backgroundColor: "#F8F3F0",
    borderRadius: 18,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    color: "#98A2B3",
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    justifyContent: "center",
    width: `${100 / 7}%`,
  },
  dayCellSelected: {
    backgroundColor: "#FF6535",
    borderRadius: 18,
  },
  dayCellDisabled: {
    opacity: 0.35,
  },
  dayText: {
    color: "#17172B",
    fontSize: 15,
    fontWeight: "900",
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
  dayTextDisabled: {
    color: "#98A2B3",
  },
  closeCalendarButton: {
    alignItems: "center",
    backgroundColor: "#EEEAE6",
    borderRadius: 16,
    marginTop: 18,
    minHeight: 52,
    justifyContent: "center",
  },
  closeCalendarText: {
    color: "#667085",
    fontSize: 15,
    fontWeight: "900",
  },
});
