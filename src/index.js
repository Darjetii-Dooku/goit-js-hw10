import Notiflix, { Notify } from 'notiflix';
import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import 'slim-select/dist/slimselect.css';
import './styles.css';

const itemsJs = {
    selector: document.querySelector('.breed-select'),
    catInfo: document.querySelector('.cat-info'),
    loader: document.querySelector('.loader'),
    error: document.querySelector('.error'),
};
const {selector, catInfo, loader, error} = itemsJs;

loader.classList.replace('loader', 'is-hidden');
error.classList.add('is-hidden');
catInfo.classList.add('is-hidden');


let arrBreedId = [];
fetchBreeds()
    .then(data => {
        data.forEach(element => {
            arrBreedId.push({text: element.name, value: element.id});
        });
    new SlimSelect({
        select: selector,
        data: arrBreedId
    });
    })
    .catch(fetchError);

selector.addEventListener('change', selectBreed);

function selectBreed(evt) {
    loader.classList.replace('is-hidden', 'loader');
    selector.classList.add('is-hidden');
    catInfo.classList.add('is-hidden');
    

    const breedId = evt.currentTarget.value;
    fetchCatByBreed(breedId)
        .then(data => {
            loader.classList.replace('loader', 'is-hidden');
            selector.classList.remove('is-hidden');
            const { url, breeds } = data[0];

            catInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`
            catInfo.classList.remove('is-hidden');
        })
        .catch(fetchError);
    };
function fetchError(error) {
    selector.classList.remove('is-hidden');
    loader.classList.replace('loader', 'is-hidden');

    Notify.failure('Oops! Something went wrong! Try reloading the page or select another cat breed!', {
        position: 'center-center',
        timeout: 5000,
        width: '500px',
        fontSize: '24px'
    });
};  
