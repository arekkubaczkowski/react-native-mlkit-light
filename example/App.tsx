import React, { useState } from 'react';
import { detectFaces, DetectionResult, FaceDetectionOptions } from 'react-native-mlkit-light';
import { Button, SafeAreaView, ScrollView, Text, View, Alert } from 'react-native';

export default function App() {
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  const testFaceDetection = async () => {
    try {
      // Example image URI - you would replace this with an actual image URI
      const imageUri = 'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_incoming&w=740&q=80';
      
      const options: FaceDetectionOptions = {
        performanceMode: 'accurate',
        landmarkMode: 'all',
        classificationMode: 'all',
        minFaceSize: 0.1,
        trackingEnabled: false
      };

      const result = await detectFaces(imageUri, options);
      setDetectionResult(result);
      
      Alert.alert('Success', `Detected ${result.faces.length} face(s)`);
    } catch (error) {
      Alert.alert('Error', `Face detection failed: ${error}`);
      console.error('Face detection error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>MLKit Face Detection</Text>
        
        <Group name="Face Detection Test">
          <Button
            title="Test Face Detection"
            onPress={testFaceDetection}
          />
        </Group>
        
        {detectionResult && (
          <Group name="Detection Result">
            <Text>Faces detected: {detectionResult.faces.length}</Text>
            {detectionResult.faces.map((face, index) => (
              <View key={index} style={styles.faceResult}>
                <Text>Face {index + 1}:</Text>
                <Text>Bounds: {JSON.stringify(face.bounds, null, 2)}</Text>
                {face.smilingProbability && (
                  <Text>Smiling: {(face.smilingProbability * 100).toFixed(1)}%</Text>
                )}
                {face.leftEyeOpenProbability && (
                  <Text>Left eye open: {(face.leftEyeOpenProbability * 100).toFixed(1)}%</Text>
                )}
                {face.rightEyeOpenProbability && (
                  <Text>Right eye open: {(face.rightEyeOpenProbability * 100).toFixed(1)}%</Text>
                )}
              </View>
            ))}
          </Group>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  faceResult: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
};
