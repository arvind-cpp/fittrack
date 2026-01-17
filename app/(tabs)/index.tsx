import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { useWorkout } from "../../contexts/WorkoutContext";

export default function HomeScreen() {
  const { userProfile, history, routines, clearHistory } = useWorkout();

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all workout history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
          },
        },
      ],
    );
  };

  const recentWorkouts = history.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{userProfile?.name || "Athlete"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <Pressable
            style={styles.primaryAction}
            onPress={() => router.push("/(tabs)/routines")}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add" size={32} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Start a New Workout</Text>
              <Text style={styles.actionSubtitle}>
                Choose from your routines
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.primaryAction,
              {
                marginTop: 16,
                backgroundColor: Colors.card,
                borderWidth: 1,
                borderColor: Colors.border,
                shadowOpacity: 0.1,
              },
            ]}
            onPress={() => router.push("/routine/create")}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: Colors.background },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={32}
                color={Colors.primary}
              />
            </View>
            <View>
              <Text style={[styles.actionTitle, { color: Colors.text }]}>
                Create Custom Routine
              </Text>
              <Text
                style={[styles.actionSubtitle, { color: Colors.textSecondary }]}
              >
                Design your own program
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          {recentWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No workouts yet. Let's get moving!
              </Text>
            </View>
          ) : (
            recentWorkouts.map((workout) => (
              <View key={workout.id} style={styles.historyCard}>
                <View>
                  <Text style={styles.historyTitle}>{workout.routineName}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(workout.startTime).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.historyMeta}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.historyTime}>
                    {Math.floor(workout.durationSeconds / 60)} min
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  username: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  clearText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "bold",
  },
  primaryAction: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  actionIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  emptyState: {
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
  },
  historyCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  historyMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  historyTime: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
