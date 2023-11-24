import {useState} from 'react';

const SearchBar = ({onCitySelect}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const getAutocompleteSuggestions = async (inputText) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${inputText}&limit=5`);
            const data = await response.json();
            setSuggestions(data.features.map(feature => feature.properties.label));
        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions:", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = async (e) => {
        setSent(false);
        const newText = e.target.value;
        setInputValue(newText);
        if (newText.length > 2) {
            await getAutocompleteSuggestions(newText);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setSuggestions([]);
        setSent(true);
        onCitySelect(suggestion);
    }

    const handleSubmit = () => {
        onCitySelect(inputValue);
        setSuggestions([]);
        setSent(true);
    }

    const clearInput = () => {
        setInputValue('');
        setSuggestions([]);
        setSent(false);
    }

    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <div className="relative flex">
                <input type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={
                        (e) => {
                            if (e.key === 'Enter') {
                                handleSubmit()
                            }
                        }
                    }
                    placeholder="Rechercher une ville"
                    className="w-48 h-12 border border-gray-300 rounded-l-2xl py-2 px-4 mix-blend-exclusion  placeholder:mix-blend-exclusion  focus:ring-0 h-10  bg-white bg-opacity-30 shadow-2xl"/> {
                sent && (
                    <span className="h-12 w-12 border border-gray-300 cursor-pointer bg-red-500 text-white flex items-center justify-center h-10 w-10 rounded-r-2xl"
                        onClick={clearInput}>
                        &#x2715;
                    </span>
                )
            }
                {
                !sent && (
                    <button className="bg-[#1B7B78] hover:bg-[#1B7B78] text-white font-bold py-2 px-4 rounded-r-2xl h-12 border border-gray-300"
                        onClick={handleSubmit}>Rechercher</button>
                )
            }

                <div className="absolute z-10 mt-1 mt-10 w-full rounded-md bg-white text-black shadow-lg max-h-60 overflow-y-auto">
                    {
                    suggestions.map((suggestion, index) => (
                        <div key={index}
                            onClick={
                                () => handleSuggestionClick(suggestion)
                            }
                            className="cursor-pointer hover:bg-gray-100 px-4 py-2">
                            {suggestion} </div>
                    ))
                } </div>
            </div>

        </div>

    );
};

export default SearchBar;
