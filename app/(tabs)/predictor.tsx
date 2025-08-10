import { ThemedText } from '@/components/ThemedText'
import { useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function Predictor() {

  const [prediction, setPrediction] = useState('predict your mood for today!')
  const [inputText, setInputText] = useState('')

  const handlePredictionChange = () => {
    if (inputText.trim() === '') {
      setPrediction('Please enter a valid prediction');
    }
    else {
      fetch(`http://192.168.8.100:8000/emotion/?text=${encodeURIComponent(inputText)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setPrediction(data.response || 'No prediction received');
        })
        .catch(() => {
          setPrediction('Error fetching prediction');
        });
    }
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
      <View style={{ padding: 5, alignItems: 'center', gap: 10, height: '100%', justifyContent: 'center' }}>
        <ThemedText type='title'>Predictor</ThemedText>
        <ThemedText type='subtitle'>Your Daily Mood Predictor</ThemedText>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <TextInput placeholder='Enter your prediction'
          value={inputText}
          onChangeText={setInputText}
          style={{ padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, margin: 10, width: '80%' }} />
          <TouchableOpacity style={{ backgroundColor: '#c12a00ff', padding: 10, borderRadius: 5 }} 
          onPress={() => setInputText('')}>
            <ThemedText type='default' style={{ color: 'white' }}>Clear</ThemedText>
          </TouchableOpacity>
        </View>
        

        <TouchableOpacity style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}
          onPress={handlePredictionChange}>
          <ThemedText type='default' style={{ color: 'white' }}>Submit Prediction</ThemedText>
        </TouchableOpacity>

        <ThemedText type='subtitle'>{prediction}</ThemedText>
      </View>
    </SafeAreaView>
  )
}

export default Predictor
