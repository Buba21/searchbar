import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import subDays from 'date-fns/subDays';
import { useTranslation } from 'react-i18next';
import Geocode from 'react-geocode';
import calendarEnd from '../images/calendar.svg';
import calendarStart from '../images/agenda.svg';
import locationPin from '../images/pin.svg';
import './filters.css';

const Filters = () => {
  const { t } = useTranslation();
  const localeBoxRef = useRef(null);
  const [localeField, setLocaleField] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [localeToggle, setLocaleToggle] = useState(false);
  const [localeData, setLocalData] = useState([`${t('current_location')}`, 'Madrid, Spain']);
  Geocode.setApiKey('AIzaSyBsUSTuf1wjXQbmcvfITcJmMTNOQ1hCstI');
  Geocode.setLanguage('en');
  Geocode.setRegion('pt');
  Geocode.setLocationType('ROOFTOP');

  const toggleLocale = () => {
    setLocaleToggle((prevState) => !prevState);
  };
  const closeLocaleBoxContainer = (e) => {
    if (localeBoxRef.current && setLocaleToggle && !localeBoxRef.current.contains(e.target)) {
      setLocaleToggle(false);
    }
  };
  document.addEventListener('mousedown', closeLocaleBoxContainer);

  const getAndSetLocation = (e) => {
    const { innerHTML } = e.target;
    if (innerHTML === t('current_location')) {
      navigator.geolocation.getCurrentPosition((local) => {
        const lat = local.coords.latitude;
        const long = local.coords.longitude;
        Geocode.fromLatLng(lat, long).then(
          (response) => {
            let city; let state; let
              country;
            for (let i = 0; i < response.results[0].address_components.length; i += 1) {
              for (let j = 0; j < response.results[0].address_components[i].types.length; j += 1) {
                switch (response.results[0].address_components[i].types[j]) {
                  case 'locality':
                    city = response.results[0].address_components[i].long_name;
                    break;
                  case 'administrative_area_level_1':
                    state = response.results[0].address_components[i].long_name;
                    break;
                  case 'country':
                    country = response.results[0].address_components[i].long_name;
                    break;
                  default:
                    break;
                }
              }
            }
            setLocaleField(`${state}, ${country}`);
            toggleLocale();
          },
          (error) => {
            console.error(error);
          },
        );
      });
    } else {
      setLocaleField(innerHTML);
      toggleLocale();
    }
  };

  return (
    <div>
      <div className="filters-wrapper">
        <div className="filters-box-container location-input">
          <img src={locationPin} alt="" className="locale-pin-icon" />
          <input
            type="text"
            placeholder={t('city_placeholder')}
            onClick={toggleLocale}
            onChange={(event) => setLocaleField(event.target.value)}
            value={localeField}
            style={{ border: 'none', width: '90%' }}
          />
        </div>
        <div className="filters-box-container">
          <img src={calendarStart} alt="" style={{ width: '15px', margin: '0 5px' }} />
          <DatePicker
            dateFormat="dd/MM/yyyy"
            placeholderText={t('start_date_placeholder')}
            selected={startDate}
            minDate={subDays(new Date(), 0)}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="filters-box-container">
          <img src={calendarEnd} alt="" style={{ width: '18px', margin: '0 5px' }} />
          <DatePicker
            dateFormat="dd/MM/yyyy"
            placeholderText={t('end_date_placeholder')}
            selected={endDate}
            minDate={subDays(new Date(), 0)}
            onChange={(date) => setEndDate(date)}
          />
        </div>
      </div>
      <div>
        {localeToggle && (
        <div className="location-dropdown-container" ref={localeBoxRef}>
          {localeData.map((data) => (
            <div key={data} className="location-dropdown-data">
              <img src={locationPin} alt="" className="locale-pin-icon" />
              <span role="button" tabIndex="0" onKeyDown={getAndSetLocation} onClick={getAndSetLocation}>
                {data}
              </span>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
