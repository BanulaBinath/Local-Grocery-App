import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

const TABS = [
  { id: "home", label: "Home", icon: "🏠", route: "/customer-home" },
  { id: "cart", label: "Cart", icon: "🛒", route: "/customer-cart" },
  { id: "orders", label: "Orders", icon: "📦", route: "/order-history" },
  { id: "feedback", label: "Feedback", icon: "💬", route: "/customer-feedback" },
];

export default function CustomerBottomNav({ active }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.item}
            onPress={() => {
              if (!isActive) {
                router.replace(tab.route);
              }
            }}
          >
            {isActive ? <View style={styles.activeLine} /> : <View style={styles.activeLineSpacer} />}
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={isActive ? styles.labelActive : styles.label}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  activeLine: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#1E3A8A",
    marginBottom: 4,
  },
  activeLineSpacer: {
    width: 18,
    height: 3,
    marginBottom: 4,
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  labelActive: {
    fontSize: 11,
    color: "#1E3A8A",
    fontWeight: "700",
  },
});
