import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  MarkerDragStartEndEvent,
  Region,
  UrlTile,
} from "react-native-maps";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const { height } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isDraggingMarker, setIsDraggingMarker] = useState(false);

  const changeMarkerPosition = (coordinate: Coordinates): void => {
    setLocation(coordinate);
  };

  const handleMapPress = (event: MapPressEvent): void => {
    changeMarkerPosition(event.nativeEvent.coordinate);
  };

  const handleMarkerDragEnd = (event: MarkerDragStartEndEvent): void => {
    setIsDraggingMarker(false);
    changeMarkerPosition(event.nativeEvent.coordinate);
  };

  const getLocation = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const region: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;
  return (
    <View style={styles.container}>
      {!location ? (
        <Button title="Get Geo Location" onPress={getLocation} />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
            scrollEnabled={!isDraggingMarker}
          >
            <UrlTile urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker
              coordinate={location}
              draggable
              anchor={{ x: 0.5, y: 0.5 }}
              title="My Location"
              description="Tap the map or long-press and drag this marker"
              onDragStart={() => setIsDraggingMarker(true)}
              onDragEnd={handleMarkerDragEnd}
            >
              <View style={styles.markerTouchArea}>
                <View style={styles.markerOuter}>
                  <View style={styles.markerInner} />
                </View>
              </View>
            </Marker>
          </MapView>

          <View style={styles.info}>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text style={styles.helpText}>
              Tap the map, or long-press the marker and drag it.
            </Text>

            <Button title="Refresh Location" onPress={getLocation} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    height: height * 0.5,
    width: "100%",
  },
  info: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
  },
  helpText: {
    marginTop: 8,
    marginBottom: 12,
    color: "#555",
  },
  markerTouchArea: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  markerOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    borderWidth: 3,
    borderColor: "#fff",
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
