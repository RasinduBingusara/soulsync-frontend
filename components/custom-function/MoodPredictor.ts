export const PredictMood = async (text: string) => {

    try{
      const response = await fetch('http://192.168.8.100:8000/emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Mood prediction response:', data.response);
      return data.response; 
    }
    catch (error) {
      console.error('Error predicting mood:', error);
      return null;
    }
  }