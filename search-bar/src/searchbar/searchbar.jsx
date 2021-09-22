import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import searchImage from '../images/magnifying-glass-search.png';
import './searchbar.css';
import 'react-datepicker/dist/react-datepicker.css';
import Filters from '../filters/filters';

const Searchbar = () => {
  const mockData = ['GoPro Hero 3', 'GoPro Hero 9', 'GoPro Hero 4 Silver', 'GOPRO 3', 'GoPro'];
  const { t, i18n } = useTranslation();
  const searchBoxRef = useRef(null);
  const [searchField, setSearchField] = useState('');
  const [searchBoxToggle, setSearchBoxToggle] = useState(false);
  const [filtersToggle, setFiltersToggle] = useState(false);
  const [searchBoxData, setSearchBoxData] = useState([]);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language.toLowerCase());
  };

  useEffect(() => {
    const filteredSearchData = mockData.filter((data) => data.toLowerCase()
      .includes(searchField.toLowerCase()));
    setSearchBoxToggle(searchField.length !== 0 && filteredSearchData.length !== 0);
    setSearchBoxData(filteredSearchData);
  }, [searchField]);

  const toggleFilters = () => {
    setFiltersToggle(!filtersToggle);
  };

  const searchItems = () => {
    window.alert(`Is this the item you wanted: ${searchField}`);
    setSearchField('');
    setSearchBoxToggle(false);
    setFiltersToggle(false);
    setSearchBoxData([]);
  };

  // This is a repetition of code, but i prefer to keep the behaviours separate to minimize,
  // the possibility of bugs and weird interactions.
  const closeSearchBoxContainer = (e) => {
    if (searchBoxRef.current && searchBoxToggle && !searchBoxRef.current.contains(e.target)) {
      setSearchBoxToggle(false);
    }
  };

  // Event listener for when the user clicks outside of the containers area
  document.addEventListener('mousedown', closeSearchBoxContainer);

  const setSearchFieldAndCloseDropdown = (data) => {
    setSearchField(data);
    setSearchBoxToggle(false);
  };

  return (
    <div>
      <div style={{ margin: '10vh 0 0 10vw' }}>
        <button
          type="button"
          className=" btn search-btn"
          style={{ marginRight: '10px' }}
          onClick={() => changeLanguage('pt')}
        >
          Pt
        </button>
        <button
          type="button"
          className=" btn search-btn"
          onClick={() => changeLanguage('en')}
        >
          En
        </button>
      </div>
      <div style={{ position: 'relative' }}>
        <div className="searchbar-container">
          <span>
            <img src={searchImage} alt="" className="search-icon" />
            <input
              type="text"
              placeholder="Ex. GoPro"
              className="input-container"
              value={searchField}
              onChange={(event) => setSearchField(event.target.value)}
            />
          </span>
          <span>
            <button
              type="button"
              className="btn filter-btn"
              onClick={toggleFilters}
            >
              {t('filter_button')}
            </button>
            <button
              type="button"
              className="btn search-btn"
              style={{ marginRight: '5px' }}
              onClick={searchItems}
            >
              {t('search_button')}
            </button>
          </span>
        </div>
        {searchBoxToggle && searchBoxData.length !== 0 && (
          <div className="search-box-container" ref={searchBoxRef}>
              {searchBoxData.map((data) => (
                <span
                  role="button"
                  tabIndex={0}
                  className="search-box-data"
                  key={data}
                  onKeyDown={() => setSearchFieldAndCloseDropdown(data)}
                  onClick={() => setSearchFieldAndCloseDropdown(data)}
                >
                  {data}
                </span>
              ))}
          </div>
        )}
        {filtersToggle && (
          <Filters />
        )}
      </div>
    </div>
  );
};

export default Searchbar;
