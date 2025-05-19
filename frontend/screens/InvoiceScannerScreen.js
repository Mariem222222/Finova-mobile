import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { createWorker } from 'tesseract.js';

const InvoiceScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // Updated access

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  // Updated camera type handling
  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (!cameraRef) return;
    setProcessing(true);
    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      processImage(photo.base64);
    } catch (error) {
      console.error('Error taking picture:', error);
      setProcessing(false);
    }
  };

  const pickImage = async () => {
    setProcessing(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        processImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
    setProcessing(false);
  };

  const processImage = async (base64Data) => {
    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(
        `data:image/jpeg;base64,${base64Data}`
      );
      
      await worker.terminate();
      
      const transactionData = parseInvoiceData(text);
      await saveTransaction(transactionData);
      navigation.goBack();

    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process invoice. Please try again.');
    }
    setProcessing(false);
  };

  const parseInvoiceData = (text) => {
    // Improved parsing logic
    const amountMatches = text.match(/(Total|Amount).*?(\d+\.\d{2})/i);
    const dateMatches = text.match(/(Date|Invoice Date).*?(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);

    return {
      description: 'Scanned Invoice',
      amount: amountMatches ? parseFloat(amountMatches[2]) : 0,
      date: dateMatches ? formatDate(dateMatches[2]) : new Date().toISOString(),
      category: 'Scanned',
      type: 'expense'
    };
  };

  const formatDate = (dateString) => {
    const parts = dateString.split(/[\/\-]/);
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]).toISOString();
    }
    return new Date().toISOString();
  };



  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>Camera permission required</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={ref => setCameraRef(ref)}
        type={cameraType} // Use state variable here
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={pickImage}
            disabled={processing}
          >
            <Text style={styles.buttonText}>📁 Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="white" size={32} />
            ) : (
              <Text style={styles.captureIcon}>📷 Capture</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraType}
          >
            <Text style={styles.buttonText}>🔄 Flip</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

// Keep the same styles as previous example
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 30,
  },
  captureButton: {
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 10,
  },
  galleryButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 10,
  },
  captureIcon: {
    fontSize: 18,
    color: 'white',
  },
  flipButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default InvoiceScannerScreen;