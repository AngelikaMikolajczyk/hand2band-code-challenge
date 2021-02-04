import { useParams } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function ImageSearchResult({ src, alt, onClick, tags }) {
    return (
        <div>
            <img src={src} alt={alt} onClick={onClick} />
            <div className="flex gap-3 mt-4">
                {tags.map((tag) => {
                    return <div className="text-gray-400 bg-gray-200 p-1 rounded-sm">{tag}</div>;
                })}
            </div>
        </div>
    );
}

const axiosConfig = {
    headers: {
        Authorization: 'Client-ID kNdVDhA2i8bcb0qHqnasc1IgNAg7vErZG1ngG1F1ugQ',
    },
};

export function Search() {
    const { query } = useParams();

    const [imageSearchResults, setImageSearchResults] = React.useState([]);

    const [currentOpenImageId, setCurrentOpenImageId] = React.useState('');

    const [placeOfMakedPhoto, setPlaceOfMakedPhoto] = React.useState('');

    function handleOnClick(id) {
        setCurrentOpenImageId(id);
        axios
            .get(`https://api.unsplash.com/photos/${id}`, axiosConfig)
            .then((response) => {
                setPlaceOfMakedPhoto(response.data.location.name);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function closeModal() {
        setCurrentOpenImageId('');
    }

    React.useEffect(() => {
        axios
            .get(`https://api.unsplash.com/search/photos?query=${query}`, axiosConfig)
            .then((response) => {
                const newImageSearchResults = response.data.results.map((imageInfo) => {
                    return {
                        id: imageInfo.id,
                        url: imageInfo.urls.regular,
                        author: imageInfo.user.name,
                        authorUsername: imageInfo.user.username,
                        altDescription: imageInfo.alt_description,
                        profileImage: imageInfo.user.profile_image.small,
                        tags: imageInfo.tags.map((tag) => tag.title),
                    };
                });
                setImageSearchResults(newImageSearchResults);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [query]);

    const currentOpenImage = imageSearchResults.find((image) => {
        return currentOpenImageId === image.id;
    });

    return (
        <div className="lg:p-20 p-8 flex flex-col items-center">
            <SearchInput initialInputValue={query} />
            <Link
                to="/"
                className="flex flex-row items-baseline text-gray-400 gap-3 text-lg font-bold cursor-pointer place-self-start"
            >
                <span>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </span>
                <div>back</div>
            </Link>
            <h1 className="text-green-700 text-5xl p-4 mb-6 font-bold">{query}</h1>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
                {imageSearchResults.map((image) => {
                    return (
                        <ImageSearchResult
                            key={image.url}
                            src={image.url}
                            alt={image.altDescription}
                            onClick={() => handleOnClick(image.id)}
                            tags={image.tags}
                        />
                    );
                })}
            </div>
            {currentOpenImage ? (
                <Modal
                    isOpen
                    onRequestClose={closeModal}
                    style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } }}
                >
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row items-center gap-4 leading-tight mb-4">
                                <img
                                    src={currentOpenImage.profileImage}
                                    alt={`profile photo of ${currentOpenImage.authorUsername}`}
                                    className="border border-gray-200 rounded-full"
                                />

                                <div className="flex flex-col">
                                    <div className="font-bold">{currentOpenImage.author}</div>
                                    <div className="font-semibold text-gray-400">
                                        @{currentOpenImage.authorUsername}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="border border-gray-400 w-8 h-8 rounded-md hover:bg-gray-200"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="h-full mx-auto">
                            <img src={currentOpenImage.url} alt={currentOpenImage.altDescription} />
                        </div>
                        {placeOfMakedPhoto ? (
                            <div className="flex flex-row gap-2 text-sm items-baseline font-bold">
                                <span>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mt-4" />
                                </span>
                                <div>{placeOfMakedPhoto}</div>
                            </div>
                        ) : null}
                    </div>
                </Modal>
            ) : null}
        </div>
    );
}
