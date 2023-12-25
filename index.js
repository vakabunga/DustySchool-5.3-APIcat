const dataLoading = 'Подождите, данные загружаются';
const dataLoaded = 'Данные успешно загружены';
const dataNotLoaded = 'Не все данные загружены, повторите попытку';
let dataLoadingResult;

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


    //request API for cat images
    fetch(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedCatId}&api_key=${THE_CAT_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const imgLoadPromises = [];

            for (let i = 0; i < data.length; i++) {
                const catImage = document.createElement('img');
                catImage.src = data[i].url;
                imageContainer.appendChild(catImage);
                imgLoadPromises.push(new Promise((resolve) => {
                    catImage.addEventListener('load', () => {
                        resolve(true);
                    });
                }))
            }

            Promise.all(imgLoadPromises)
                .then((result) => {
                    if (result.every(element => element === true)) {
                        statusContainer.textContent += dataLoaded;
                    } else {
                        statusContainer.textContent += dataNotLoaded;
                    }
                })
        })
        .catch(error => {
            statusContainer.textContent = error;
        })
        .finally(() => {
            statusContainer.textContent = `Вы выбрали породу ${selectedCatName}. `;
            dropDownListFormButton.disabled = false;
        })

});
