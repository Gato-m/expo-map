import { useTheme } from "@shopify/restyle";
import { AppleMaps, GoogleMaps } from "expo-maps";
import React, { useMemo, useRef, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "../../components";
import { ThemedIcon } from "../../components/ThemedIcon";
import { ThemeToggleButton } from "../../components/ThemeToggleButton";
import { useThemeMode } from "../../providers/ThemeProvider";
import { Theme } from "../../theme";

const CENTER = {
  latitude: 56.85176,
  longitude: 26.221161,
};
const DEFAULT_ZOOM = 14;
const CHIPS_TOP_OFFSET = 26;
const CONTROLS_TOP_OFFSET = CHIPS_TOP_OFFSET;
const TOP_OVERLAY_EXTRA_HEIGHT = 170;
const TAB_BAR_HEIGHT = 60;
const TAB_BAR_BOTTOM_OFFSET = 34;
const TAB_BAR_TOTAL_OFFSET = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_OFFSET;
const BG_TOP = require("../../../assets/images/bg_top.png");
const BG_BOTTOM = require("../../../assets/images/bg_bottom.png");
const BG_BOTTOM_RATIO =
  Image.resolveAssetSource(BG_BOTTOM).width /
  Image.resolveAssetSource(BG_BOTTOM).height;
const GOOGLE_MAP_STYLE_NO_POI = JSON.stringify([
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
]);

// ─── Filter definitions ───────────────────────────────────────────────────────

type FilterId =
  | "events"
  | "concert"
  | "exhibition"
  | "sport"
  | "children"
  | "traffic"
  | "restriction"
  | "cafe";

const FILTERS: { id: FilterId; label: string; icon: string }[] = [
  { id: "events", label: "Events", icon: "calendar-outline" },
  { id: "concert", label: "Concert", icon: "musical-notes-outline" },
  { id: "exhibition", label: "Exhibition", icon: "easel-outline" },
  { id: "sport", label: "Sport", icon: "barbell-outline" },
  { id: "children", label: "Children", icon: "happy-outline" },
  { id: "traffic", label: "Traffic", icon: "car-outline" },
  { id: "restriction", label: "Restrictions", icon: "ban-outline" },
  { id: "cafe", label: "Cafe", icon: "cafe-outline" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { mode } = useThemeMode();
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const isDarkMode = mode === "dark";

  const appleMapRef = useRef<AppleMaps.MapView>(null);
  const googleMapRef = useRef<GoogleMaps.MapView>(null);

  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set());

  const initialCameraPosition = useMemo(
    () => ({ coordinates: CENTER, zoom: DEFAULT_ZOOM }),
    [],
  );

  function toggleFilter(id: FilterId) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function centerMap() {
    if (Platform.OS === "ios") {
      appleMapRef.current?.setCameraPosition({
        coordinates: CENTER,
        zoom: DEFAULT_ZOOM,
      });
    } else if (Platform.OS === "android") {
      googleMapRef.current?.setCameraPosition({
        coordinates: CENTER,
        zoom: DEFAULT_ZOOM,
      });
    }
  }

  // ─── Shared pill button style ───────────────────────────────────────────────

  const circleButtonStyle = (pressed: boolean) => [
    styles.circleButton,
    {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.gray200,
      opacity: pressed ? 0.8 : 1,
    },
  ];

  // ─── Filter chips ───────────────────────────────────────────────────────────

  const filterChips = (
    <View style={[styles.filtersRow, { top: insets.top + CHIPS_TOP_OFFSET }]}>
      <View style={styles.filtersContent}>
        {FILTERS.map((f) => {
          const active = activeFilters.has(f.id);
          return (
            <Pressable
              key={f.id}
              onPress={() => toggleFilter(f.id)}
              accessibilityRole="button"
              accessibilityLabel={f.label}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active
                    ? theme.colors.accent
                    : theme.colors.primary,
                  borderColor: active
                    ? theme.colors.accent
                    : theme.colors.gray200,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemedIcon
                name={f.icon}
                size={16}
                variant={active ? "white" : "text"}
              />
              <ThemedText
                style={[
                  styles.chipLabel,
                  { color: active ? theme.colors.white : theme.colors.text },
                ]}
              >
                {f.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  // ─── Top-right controls ─────────────────────────────────────────────────────

  const controls = (
    <View style={[styles.controls, { top: insets.top + CONTROLS_TOP_OFFSET }]}>
      <ThemeToggleButton />
      <Pressable
        onPress={centerMap}
        accessibilityRole="button"
        accessibilityLabel="Center map"
        style={({ pressed }) => circleButtonStyle(pressed)}
      >
        <ThemedIcon name="scan-outline" size={20} variant="text" />
      </Pressable>
    </View>
  );

  const topOverlay = (
    <View
      pointerEvents="none"
      style={[
        styles.topOverlay,
        {
          top: -45,
          height: insets.top + CHIPS_TOP_OFFSET + TOP_OVERLAY_EXTRA_HEIGHT,
        },
      ]}
    >
      <Image
        source={BG_TOP}
        style={styles.topOverlayImage}
        resizeMode="contain"
      />
    </View>
  );

  const bottomOverlay = (
    <View
      pointerEvents="none"
      style={[styles.bottomOverlay, { bottom: -TAB_BAR_TOTAL_OFFSET }]}
    >
      <Image
        source={BG_BOTTOM}
        style={styles.bottomOverlayImage}
        resizeMode="contain"
      />
    </View>
  );

  // ─── Platforms ──────────────────────────────────────────────────────────────

  if (Platform.OS === "ios") {
    return (
      <View style={styles.container}>
        <AppleMaps.View
          ref={appleMapRef}
          style={styles.map}
          colorScheme={
            isDarkMode
              ? AppleMaps.MapColorScheme.DARK
              : AppleMaps.MapColorScheme.LIGHT
          }
          cameraPosition={initialCameraPosition}
          properties={{
            mapType: AppleMaps.MapType.STANDARD,
            pointsOfInterest: { including: [] },
          }}
          uiSettings={{
            myLocationButtonEnabled: false,
            togglePitchEnabled: true,
          }}
        />
        {topOverlay}
        {bottomOverlay}
        {controls}
        {filterChips}
      </View>
    );
  }

  if (Platform.OS === "android") {
    return (
      <View style={styles.container}>
        <GoogleMaps.View
          ref={googleMapRef}
          style={styles.map}
          colorScheme={
            isDarkMode
              ? GoogleMaps.MapColorScheme.DARK
              : GoogleMaps.MapColorScheme.LIGHT
          }
          cameraPosition={initialCameraPosition}
          properties={{
            mapType: GoogleMaps.MapType.NORMAL,
            isBuildingEnabled: true,
            mapStyleOptions: { json: GOOGLE_MAP_STYLE_NO_POI },
          }}
          uiSettings={{
            myLocationButtonEnabled: false,
            tiltGesturesEnabled: true,
            togglePitchEnabled: true,
          }}
        />
        {topOverlay}
        {bottomOverlay}
        {controls}
        {filterChips}
      </View>
    );
  }

  return (
    <View style={styles.webFallback}>
      <ThemedText style={styles.fallbackText}>
        Expo Maps is available on iOS and Android only.
      </ThemedText>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  topOverlayImage: {
    width: "100%",
    height: "100%",
  },
  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  bottomOverlayImage: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -50,
    width: "100%",
    aspectRatio: BG_BOTTOM_RATIO,
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  // Top-right control column
  controls: {
    position: "absolute",
    right: 16,
    gap: 10,
    alignItems: "center",
    zIndex: 3,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  // Filter row
  filtersRow: {
    position: "absolute",
    left: 12,
    right: 72,
    zIndex: 3,
  },
  filtersContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    shadowColor: "#000000",
    shadowOpacity: Platform.OS === "ios" ? 0.16 : 0,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 0,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  // Web fallback
  webFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  fallbackText: {
    textAlign: "center",
  },
});
