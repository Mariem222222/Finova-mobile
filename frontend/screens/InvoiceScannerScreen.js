import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const ImageAnalysisScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(''); // Clear previous results
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    try {
      // Resize and convert image to base64
      const resizedImage = await manipulateAsync(
        selectedImage,
        [{ resize: { width: 500 } }],
        { format: SaveFormat.JPEG, base64: true }
      );

      // Prepare for AI processing (simulated)
      const base64Data = `data:image/jpeg;base64,${resizedImage.base64}`;
      
      // This would be your actual API call to DeepSeek or your backend:
      const result = await simulateDeepSeekAnalysis(base64Data);
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated DeepSeek analysis function
  const simulateDeepSeekAnalysis = async (base64Image) => {
    // In a real app, you would send the image to your backend
    // which would then call DeepSeek's API with proper authentication
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock responses based on image content
    const mockResponses = [
      "Analysis: This image appears to show a scenic mountain landscape with a lake reflection. Natural beauty suggests potential travel destination.",
      "Analysis: Detected food item - possibly a gourmet burger with fries. Estimated calories: 650-750 kcal.",
      "Analysis: Document identified as utility bill. Key fields detected: Account number, Due date, Amount due.",
      "Analysis: App UI screenshot showing login screen. Suggestions: Increase contrast for better accessibility."
    ];
    
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan your Invoice</Text>
      
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {selectedImage && !isLoading && (
        <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
          <Text style={styles.buttonText}>Analyze Image</Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5E60CE" />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      )}

      {analysisResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Analysis Results:</Text>
          <Text style={styles.resultText}>{analysisResult}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  placeholderContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#1E1E2D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#0F62FE',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#48BFE3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginTop: 20,
    elevation: 3,
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});

export default ImageAnalysisScreen;