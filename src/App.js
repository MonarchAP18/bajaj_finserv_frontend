import React, { useState } from 'react';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    Alphabets: false,
    Numbers: false,
    'Highest lowercase alphabet': false,
  });

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        alert('Invalid JSON input');
        return;
      }

      const res = await fetch('http://localhost:5000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      } else {
        alert('Failed to fetch data from the backend');
      }
    } catch (error) {
      alert('Invalid JSON input');
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  const renderResponse = () => {
    if (!response) return null;

    const renderedResponse = {};
    if (selectedOptions.Alphabets) {
      renderedResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.Numbers) {
      renderedResponse.numbers = response.numbers;
    }
    if (selectedOptions['Highest lowercase alphabet']) {
      renderedResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return (
      <div>
        <p><strong>is_success:</strong> {response.is_success.toString()}</p>
        <p><strong>user_id:</strong> {response.user_id}</p>
        <p><strong>email:</strong> {response.email}</p>
        <p><strong>roll_number:</strong> {response.roll_number}</p>
        {selectedOptions.Numbers && (
          <p><strong>numbers:</strong> {JSON.stringify(response.numbers)}</p>
        )}
        {selectedOptions.Alphabets && (
          <p><strong>alphabets:</strong> {JSON.stringify(response.alphabets)}</p>
        )}
        {selectedOptions['Highest lowercase alphabet'] && (
          <p><strong>highest_lowercase_alphabet:</strong> {JSON.stringify(response.highest_lowercase_alphabet)}</p>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Your Roll Number</h1>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON input here...'
        />
        <button onClick={handleSubmit}>Submit</button>
        {response && (
          <div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="Alphabets"
                  checked={selectedOptions.Alphabets}
                  onChange={handleCheckboxChange}
                />
                Alphabets
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Numbers"
                  checked={selectedOptions.Numbers}
                  onChange={handleCheckboxChange}
                />
                Numbers
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Highest lowercase alphabet"
                  checked={selectedOptions['Highest lowercase alphabet']}
                  onChange={handleCheckboxChange}
                />
                Highest lowercase alphabet
              </label>
            </div>
            <div>{renderResponse()}</div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
