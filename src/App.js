import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://20.244.56.144/test";  // Test Server Base URL
const WINDOW_SIZE = 10;  // Configure window size

const AverageCalculator = () => {
    const [windowPrevState, setWindowPrevState] = useState([]);
    const [windowCurrState, setWindowCurrState] = useState([]);
    const [numbersFromApi, setNumbersFromApi] = useState([]);
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to fetch numbers from the third-party server
    const fetchNumbers = async (type) => {
        setLoading(true);
        let url = {API_BASE_URL}/{type};
        try {
            const response = await axios.get(url, { timeout: 500 });
            let fetchedNumbers = response.data.numbers;

            // Filter unique numbers
            let uniqueNumbers = [...new Set(fetchedNumbers)];
            setNumbersFromApi(uniqueNumbers);
            
            updateWindow(uniqueNumbers);

        } catch (error) {
            console.error("Error fetching numbers or timeout exceeded", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to update the window and calculate the average
    const updateWindow = (newNumbers) => {
        let newWindowPrevState = [...windowCurrState];
        let updatedWindowState = [...windowCurrState, ...newNumbers];

        // Maintain the window size
        if (updatedWindowState.length > WINDOW_SIZE) {
            updatedWindowState = updatedWindowState.slice(updatedWindowState.length - WINDOW_SIZE);
        }

        setWindowPrevState(newWindowPrevState);
        setWindowCurrState(updatedWindowState);

        // Calculate average if window size is full
        if (updatedWindowState.length >= WINDOW_SIZE) {
            const avg = updatedWindowState.reduce((acc, num) => acc + num, 0) / WINDOW_SIZE;
            setAverage(avg.toFixed(2));
        } else {
            setAverage(null);  // If not full, don't show average
        }
    };

    // Function to handle requests for different number types
    const handleRequest = (type) => {
        fetchNumbers(type);
    };

    return (
        <div>
            <h1>Average Calculator Microservice</h1>
            <button onClick={() => handleRequest('primes')} disabled={loading}>Fetch Primes</button>
            <button onClick={() => handleRequest('fibonacci')} disabled={loading}>Fetch Fibonacci</button>
            <button onClick={() => handleRequest('even')} disabled={loading}>Fetch Even</button>
            <button onClick={() => handleRequest('random')} disabled={loading}>Fetch Random</button>

            <div>
                <h2>Results</h2>
                <p><strong>Previous Window State:</strong> {JSON.stringify(windowPrevState)}</p>
                <p><strong>Current Window State:</strong> {JSON.stringify(windowCurrState)}</p>
                <p><strong>Fetched Numbers:</strong> {JSON.stringify(numbersFromApi)}</p>
                {average && <p><strong>Average:</strong> {average}</p>}
            </div>
        </div>
    );
};

export default AverageCalculator;