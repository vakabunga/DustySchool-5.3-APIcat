const dataLoading = 'Подождите, данные загружаются';
const dataLoaded = 'Данные успешно загружены';

//create container for cat app
const catsContainer = document.createElement('div');
const page = document.querySelector('.page');
page.appendChild(catsContainer);

//create drop-down list and form
const dropDownListForm = document.createElement('form');
const dropDownListFormSelect = document.createElement('select');
const dropDownListFormButton = document.createElement('button')
catsContainer.appendChild(dropDownListForm);
dropDownListForm.appendChild(dropDownListFormSelect);
dropDownListForm.appendChild(dropDownListFormButton);
dropDownListFormButton.textContent = 'Выбрать';

//create status container
const statusContainer = document.createElement('p');
catsContainer.appendChild(statusContainer);

//create images container
const imageContainer = document.createElement('div');
catsContainer.appendChild(imageContainer);

//starting conditions
statusContainer.textContent = dataLoading;
dropDownListFormButton.disabled = true;
let translatedCatBreed;

//send request to get all cat breeds
fetch('https://api.thecatapi.com/v1/breeds')
    .then(response => response.json())
    .then(cats => {
        for (const cat of cats) {
            const catElement = document.createElement('option');
            catElement.classList.add('option');
            catElement.textContent = cat.name;
            catElement.dataset.id = cat.id;
            dropDownListFormSelect.appendChild(catElement);
        }
    })
    .catch(error => {
        statusContainer.textContent = error.message
    })
    .finally(() => {
        statusContainer.textContent = dataLoaded;
        dropDownListFormButton.disabled = false;
    })

//create event handler when cat is checked
dropDownListFormButton.addEventListener('click', (event) => {
    event.preventDefault();
    imageContainer.innerHTML = '';
    const selectedCatName = dropDownListFormSelect.options[dropDownListFormSelect.selectedIndex].value;
    const selectedCatId = dropDownListFormSelect.options[dropDownListFormSelect.selectedIndex].dataset.id;
    statusContainer.textContent = dataLoading;
    dropDownListFormButton.disabled = true;

    //request API to translate breed
    fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': TRANSLATOR_API_KEY,
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        body: new URLSearchParams({
            q: selectedCatName,
            target: 'ru',
            source: 'en'
        })
    })
        .then(response => response.json())
        .then(result => {
            translatedCatBreed = result.data.translations[0].translatedText;
            statusContainer.textContent = `Вы выбрали породу ${translatedCatBreed}. ` + dataLoading;
        })

    //request API for cat images
    fetch(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedCatId}&api_key=${THE_CAT_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const catImage = document.createElement('img');
                catImage.src = data[i].url;
                imageContainer.appendChild(catImage);
            }
        })
        .catch(error => {
            statusContainer.textContent = error
        })
        .finally(() => {
            statusContainer.textContent = `Вы выбрали породу ${translatedCatBreed}. ` + dataLoaded;
            dropDownListFormButton.disabled = false;
        })
})
