import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

const App = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
    
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log('API Response:', data);
    
        if (data.address) {
          setAddress(`${data.address.road}, ${data.address.city}, ${data.address.state}, ${data.address.country},${data.address.state_district},${data.address.display_name}`);
        } else {
          alert('No address found for the given coordinates');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        alert(`An error occurred: ${error.message}`);
      }
  };

  return (
    <View>
      {location ? (
        <>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Button
            title="Get Address"
            onPress={() => getAddressFromCoordinates(location.coords.latitude, location.coords.longitude)}
          />
        </>
      ) : (
        <Text>Fetching location...</Text>
      )}
      {address && <Text>Address: {address}</Text>}
    </View>
  );
};

export default App;
