export const PredictSuggestion = async (title:string,description:string) => {

    try{
    const response = await fetch('http://192.168.8.100:8000/suggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Suggestion prediction response:', data.response);
      return data.response; 
    }
    catch (error) {
      console.error('Error predicting suggestion:', error);
      return null;
    }
  }

export const ActionSuggest = async (content:string) => {

    try{
    const response = await fetch('http://192.168.8.100:8000/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text:content}),
    });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Suggestion action response:', data.response);
      return data.response; 
    }
    catch (error) {
      console.error('Error action suggestion:', error);
      return null;
    }
  }