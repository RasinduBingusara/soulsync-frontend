import { addDoc, collection, getFirestore, arrayUnion } from '@react-native-firebase/firestore';

const db = getFirestore();

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