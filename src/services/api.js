export const fetchToken = async () => {
  const endpoint = 'https://opentdb.com/api_token.php?command=request';
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.token;
};

export const fetchQuestions = async () => {
  const endpoint = 'http://localhost:3000/perguntas.json';
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.results;
};

export const fetchCategories = async () => {
  const response = await fetch('https://opentdb.com/api_category.php');
  const data = await response.json();
  return data.trivia_categories;
};
