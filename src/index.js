import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const result = inputEl.value.trim();
  fetchCountries(result).then(createMarckup).catch(onError);
  if (result === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
  }
}

function createMarckup(countries) {
  countryList.innerHTML = countries.reduce(
    (acc, { name: { official }, flags: { svg } }) => {
      return (
        acc +
        `
    <li><img src =${svg} alt ="flag" width ="100"/>
    <p><b>Official name: </b>${official}</p>
    </li>`
      );
    },
    ''
  );
  if (countries.length === 1) {
    countryInfo.innerHTML = countries.reduce(
      (acc, { capital, population, languages }) => {
        return (
          acc +
          `
     <p><b>Capital: </b>${capital}</p>
    <p><b>Population: </b>${population}</p>
    <p><b>Languages: </b>${Object.values(languages)}</p>`
        );
      },
      ''
    );
  }

  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countryList.innerHTML = '';
  }

}

function onError(err) {
  console.error(err);
  Notiflix.Notify.failure('Oops, there is no country with that name')
}