import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";

export function LoadingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loadingScreen}>
        <ActivityIndicator color="#b85f2b" size="large" />
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
  loadingScreen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
