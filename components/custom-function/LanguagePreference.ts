import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLanguagePreference = async (userId: string, languageCode: string) => {
    try {
        const key = `language_preference:${userId}`;

        await AsyncStorage.setItem(key, languageCode);

        console.log(`Language preference '${languageCode}' saved for user '${userId}'.`);
    } catch (error) {
        console.error("Error saving language preference:", error);
    }
};

export const getLanguagePreference = async (userId: string) => {
    try {
        const key = `language_preference:${userId}`;
        const languageCode = await AsyncStorage.getItem(key);

        console.log(`Retrieved language preference for user '${userId}':`, languageCode);
        return languageCode;

    } catch (error) {
        console.error("Error retrieving language preference:", error);
        return null;
    }
};
