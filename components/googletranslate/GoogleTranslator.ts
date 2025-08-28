import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_KEY = 'AIzaSyC37A9ar47Rfh9l728EChsWlyoIa3n0Jjs';
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

export const translateTextToSinhala = async (text:string) => {
  const response = await axios.post(
    `${API_URL}?key=${API_KEY}`,
    {
      q: text,
      target: 'si',
    }
  );
  return response.data.data.translations[0].translatedText;
};

export const translateTextToEnglish = async (text:string) => {
    const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
            q: text,
            target: 'en',
        }
    );
    return response.data.data.translations[0].translatedText;
};

export const getSelectedLanguage = async () => {
    const storedLang = await AsyncStorage.getItem('selected-language');
    return storedLang ? storedLang : null;
};
