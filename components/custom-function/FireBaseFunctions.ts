import { addDoc, collection, getFirestore, arrayUnion } from '@react-native-firebase/firestore';
import { getAuth } from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';

const db = getFirestore();
const auth = getAuth();

export const saveDailyMood = async (userId:string, mood:string, text:string) => {
  try {
    const docRef = db.collection('MoodEntries').doc(userId);

    // Get the existing entries array
    const docSnapshot = await docRef.get();
    let existingEntries: any[] = [];
    const data = docSnapshot.data();
    if (docSnapshot.exists() && data && data.entries) {
      existingEntries = data.entries;
    }

    // Add the new entry to the front of the array
    const newEntry = {
      mood: mood,
      text: text,
      timestamp: new Date(),
    };
    const updatedEntries = [newEntry, ...existingEntries];

    // Save the updated array
    await docRef.set(
      { entries: updatedEntries },
      { merge: true }
    );

    console.log("Document successfully written with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const SignOut = async () => {
    try {

      await GoogleSignin.signOut();

      await auth.signOut();

      router.push('/')

      console.log('User signed out successfully from both Firebase and Google.');

    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

export const getCurrentUser = () => {
    return auth.currentUser;
  }