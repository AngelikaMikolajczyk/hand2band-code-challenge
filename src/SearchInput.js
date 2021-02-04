import React from 'react';
import { useHistory } from 'react-router-dom';
import TextInput from 'react-autocomplete-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import 'react-autocomplete-input/dist/bundle.css';
import axios from 'axios';
import './SearchInput.css';

const proxy = `https://api.allorigins.win/raw?url=`;

export function SearchInput({ initialInputValue = '' }) {
    const [inputOptions, setInputOptions] = React.useState([]);

    const [inputValue, setInputValue] = React.useState(initialInputValue);

    const history = useHistory();

    function handleOnChange(value) {
        setInputValue(value);
    }

    function handleOnSelect(value) {
        history.push(`/search/${value}`);
    }

    function handleOnKeyDown(event) {
        if (event.key === 'Enter') {
            handleOnSelect(inputValue);
        }
    }

    React.useEffect(() => {
        if (inputValue.length >= 3) {
            axios
                .get(`${proxy}${encodeURIComponent(`https://unsplash.com/nautocomplete/${inputValue}`)}`)
                .then((response) => {
                    const newInputOptions = response.data.autocomplete.map((element) => {
                        return element.query;
                    });
                    setInputOptions(newInputOptions);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [inputValue]);

    return (
        <div className="w-full max-w-2xl m-6">
            <div className="autocomplete w-full border rounded-lg p-4 flex shadow-lg focus-within:ring-2 ring-green-700 ring-opacity-30 bg-white">
                <span className="pr-3">
                    <FontAwesomeIcon icon={faSearch} className="text-2xl text-green-600" />
                </span>
                <TextInput
                    options={inputOptions}
                    Component={'input'}
                    placeholder={'Search free high-resolution photos'}
                    trigger={''}
                    minChars={3}
                    onChange={handleOnChange}
                    value={inputValue}
                    onSelect={handleOnSelect}
                    passThroughEnter
                    onKeyDown={handleOnKeyDown}
                    spacer={''}
                    regex={'^[a-zA-Z0-9_\\-\\s]+$'}
                    className="text-xl w-full outline-none"
                    offsetY={50}
                />
            </div>
            {inputValue.length >= 3 && inputOptions.length === 0 ? (
                <span className="text-lg font-bold">no suggestions</span>
            ) : null}
        </div>
    );
}
