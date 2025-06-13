import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const ImageAnalysisScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const pickImage = async () => {
    console.log("Starting image picker...");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log("Camera roll permission denied");
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image picker result:", result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setExtractedData(null);
      setSaveStatus('');
      console.log("SELECTED IMAGE URI:", result.assets[0].uri);
    } else {
      console.log("Image selection canceled");
    }
  };

  // Google Cloud Vision API integration
  const analyzeWithGoogleVision = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    try {
      console.log("Starting OCR with Google Cloud Vision API...");
      
      // Process image to base64
      const processedImage = await manipulateAsync(
        selectedImage,
        [{ resize: { width: 1024 } }],
        { format: SaveFormat.JPEG, base64: true, compress: 0.8 }
      );

      const base64Data = processedImage.base64;
      console.log("Image processed to base64");
      
      // Google Cloud Vision API configuration
      const API_KEY ="AIzaSyCOJHKgWH2Tph0K5O72cw9eRTd44IYrYVU";
      const API_ENDPOINT = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

      const requestBody = {
        requests: [
          {
            image: {
              content: base64Data
            },
            features: [
              {
                type: "TEXT_DETECTION",
                maxResults: 1
              }
            ]
          }
        ]
      };

      console.log("Sending request to Google Cloud Vision API...");
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      console.log("Google Vision API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Vision API request failed');
      }

      if (responseData.responses && responseData.responses[0]?.textAnnotations) {
        const extractedText = responseData.responses[0].textAnnotations[0].description;
        console.log("Extracted text:", extractedText);
        
        const expenseData = parseReceiptText(extractedText);
        if (expenseData) {
          setExtractedData(expenseData);
          setIsConfirming(true);
          console.log("Google Vision OCR analysis successful");
        } else {
          setSaveStatus('Could not extract expense data from the receipt. Please try a clearer image.');
        }
      } else {
        setSaveStatus('No text detected in the image. Please try a clearer receipt.');
      }
    } catch (error) {
      console.error('Google Vision OCR Error:', error);
      setSaveStatus(`OCR failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced receipt text parser
  const parseReceiptText = (text) => {
    console.log("Parsing receipt text...");
    
    try {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      console.log(`Processing ${lines.length} lines from OCR`);
      
      let merchant = '';
      let date = '';
      let total = 0;
      const items = [];
      
      // Enhanced patterns for better detection
      const datePatterns = [
        /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/,
        /\b(\d{1,2}\s+\w{3}\s+\d{2,4})\b/,
        /\b(\w{3}\s+\d{1,2},?\s+\d{4})\b/,
        /date[:\s]+([^\n]+)/i,
        /\b(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/
      ];
      
      const totalPatterns = [
        /total[:\s]*\$?(\d+\.?\d*)/i,
        /amount[:\s]*\$?(\d+\.?\d*)/i,
        /grand\s+total[:\s]*\$?(\d+\.?\d*)/i,
        /balance[:\s]*\$?(\d+\.?\d*)/i,
        /\$(\d+\.\d{2})\s*$/,
        /(\d+\.\d{2})\s*total/i
      ];
      
      const pricePattern = /\$?(\d+\.?\d{2})/;
      const itemLinePattern = /^(.+?)\s+\$?(\d+\.\d{2})$/;
      
      // Find merchant (usually first meaningful line, skip common receipt headers)
      const skipWords = ['receipt', 'invoice', 'transaction', 'copy', 'customer'];
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i].toLowerCase();
        if (line.length > 3 && 
            !skipWords.some(word => line.includes(word)) &&
            !line.match(/\d{1,2}[\/\-\.]\d/) && 
            !line.includes('*') &&
            !line.includes('=')) {
          merchant = lines[i];
          console.log(`Found merchant: ${merchant}`);
          break;
        }
      }
      
      // Process all lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        
        // Extract date
        if (!date) {
          for (const pattern of datePatterns) {
            const match = line.match(pattern);
            if (match) {
              date = match[1];
              console.log(`Found date: ${date}`);
              break;
            }
          }
        }
        
        // Extract total
        if (!total) {
          for (const pattern of totalPatterns) {
            const match = line.match(pattern);
            if (match) {
              const totalValue = parseFloat(match[1]);
              if (totalValue > 0 && totalValue < 10000) { // Reasonable total range
                total = totalValue;
                console.log(`Found total: $${total}`);
                break;
              }
            }
          }
        }
        
        // Extract items with improved logic
        const itemMatch = line.match(itemLinePattern);
        if (itemMatch) {
          const itemName = itemMatch[1].trim();
          const price = parseFloat(itemMatch[2]);
          
          // Filter out non-item lines
          if (!lowerLine.includes('total') && 
              !lowerLine.includes('tax') && 
              !lowerLine.includes('change') &&
              !lowerLine.includes('subtotal') &&
              !lowerLine.includes('discount') &&
              !lowerLine.includes('card') &&
              !lowerLine.includes('cash') &&
              itemName.length > 1 && 
              price > 0 && 
              price < 1000) {
            
            items.push({ 
              name: itemName.replace(/[^\w\s\-]/g, ' ').trim(), 
              price: price 
            });
            console.log(`Found item: ${itemName} - $${price}`);
          }
        }
      }
      
      // Enhanced fallbacks
      if (!merchant && lines.length > 0) {
        // Try to find a reasonable merchant name from first few lines
        for (let i = 0; i < Math.min(3, lines.length); i++) {
          if (lines[i].length > 2 && !lines[i].match(/\d{2,}/)) {
            merchant = lines[i];
            break;
          }
        }
        if (!merchant) merchant = lines[0];
      }
      
      if (!date) date = new Date().toLocaleDateString('en-US');
      
      if (!total && items.length > 0) {
        total = items.reduce((sum, item) => sum + item.price, 0);
        console.log(`Calculated total from items: $${total}`);
      }
      
      // Final validation
      if (total === 0 && items.length === 0) {
        console.log("No meaningful data extracted");
        return null;
      }
      
      const result = {
        merchant: merchant || 'Unknown Merchant',
        date: date,
        total_amount: total,
        items: items
      };
      
      console.log("Parsing completed:", result);
      return result;
      
    } catch (error) {
      console.error('Receipt parsing error:', error);
      return null;
    }
  };



  const confirmExpense = async () => {
    if (!extractedData) {
      console.log("No extracted data to save");
      return;
    }
    
    console.log("Confirming expense...", extractedData);
    setIsSaving(true);
    setIsConfirming(false);
    
    try {
      console.log("Saving expense to backend...");
      // Replace with your actual backend endpoint
      const response = await fetch('https://your-backend.com/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer USER_AUTH_TOKEN'
        },
        body: JSON.stringify({
          ...extractedData,
          type: 'expense',
          confirmed: true,
          timestamp: new Date().toISOString()
        })
      });

      console.log("Backend response status:", response.status);
      const result = await response.json();
      console.log("Backend response data:", result);
      
      if (response.ok) {
        console.log("Expense saved successfully");
        setSaveStatus('Expense saved successfully!');
        setExtractedData(null);
        setSelectedImage(null);
      } else {
        console.log("Save failed with response:", result);
        setSaveStatus(`Save failed: ${result.message}`);
      }
    } catch (error) {
      console.error('SAVE ERROR:', error);
      setSaveStatus('Error saving expense. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderConfirmationModal = () => (
    <Modal
      visible={isConfirming}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsConfirming(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Expense</Text>
          
          {extractedData && (
            <View style={styles.expenseDetails}>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Merchant: </Text>
                {extractedData.merchant || 'N/A'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Date: </Text>
                {extractedData.date || 'N/A'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Amount: </Text>
                ${extractedData.total_amount?.toFixed(2) || '0.00'}
              </Text>
              {extractedData.items?.length > 0 && (
                <>
                  <Text style={styles.detailLabel}>Items:</Text>
                  {extractedData.items.map((item, index) => (
                    <Text key={index} style={styles.itemText}>
                      • {item.name}: ${item.price?.toFixed(2)}
                    </Text>
                  ))}
                </>
              )}
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setIsConfirming(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]} 
              onPress={confirmExpense}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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

      {selectedImage && !isLoading && !isConfirming && (
        <>
          <TouchableOpacity style={styles.googleVisionButton} onPress={analyzeWithGoogleVision}>
            <Text style={styles.buttonText}>🥈 Analyze with Google Vision (Free)</Text>
          </TouchableOpacity>
        
        </>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5E60CE" />
          <Text style={styles.loadingText}>Analyzing receipt...</Text>
        </View>
      )}
      
      {isSaving && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48BFE3" />
          <Text style={styles.loadingText}>Saving expense...</Text>
        </View>
      )}

      {saveStatus ? (
        <View style={saveStatus.includes('success') 
          ? styles.successContainer 
          : styles.errorContainer
        }>
          <Text style={styles.statusText}>{saveStatus}</Text>
        </View>
      ) : null}

      {renderConfirmationModal()}
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
  googleVisionButton: {
    backgroundColor: '#34A853', // Google green
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  tesseractButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#FF6B35', // OpenAI orange
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  expenseDetails: {
    marginBottom: 25,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#444',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  successContainer: {
    backgroundColor: '#10B98120',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    padding: 15,
    marginTop: 20,
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#EF444420',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 15,
    marginTop: 20,
    width: '100%',
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ImageAnalysisScreen;