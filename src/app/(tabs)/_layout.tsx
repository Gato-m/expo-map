import { useTheme } from "@shopify/restyle";
import { Tabs } from "expo-router";
import TabBarIcon from "../../components/TabBarIcon";
import { Theme } from "../../theme";

export default function TabsLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          marginLeft: 84,
          marginRight: 84,
          bottom: 34,
          height: 60,
          paddingTop: 9,
          paddingBottom: 0,
          backgroundColor: "transparent",
        },
        tabBarItemStyle: {
          margin: 0,
          height: "100%",
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.text,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="map-outline"
              color={color}
              focused={focused}
              activeBackgroundColor={theme.colors.accent}
              inactiveBackgroundColor={theme.colors.gray800}
              activeBorderColor={theme.colors.white}
              inactiveBorderColor={theme.colors.gray800}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="list-outline"
              color={color}
              focused={focused}
              activeBackgroundColor={theme.colors.accent}
              inactiveBackgroundColor={theme.colors.gray800}
              activeBorderColor={theme.colors.white}
              inactiveBorderColor={theme.colors.gray800}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="information-circle-outline"
              color={color}
              focused={focused}
              activeBackgroundColor={theme.colors.accent}
              inactiveBackgroundColor={theme.colors.gray800}
              activeBorderColor={theme.colors.white}
              inactiveBorderColor={theme.colors.gray800}
            />
          ),
        }}
      />
    </Tabs>
  );
}
