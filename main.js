const addField = document.getElementById('tovarInput')
const addButton = document.getElementById('addTovar')
const blList = document.querySelector('.bl-list')
const unboughtList = document.querySelector('.bl-rowB-left')
const boughtList = document.querySelector('.bl-rowB-bought')

let id = 0;

addButton.addEventListener('click', () => {
    const tovarName = addField.value
    addToList(tovarName)
})

addField.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        console.log("work");
        addButton.click();
    }
})



function addToList(tovarName, number = 1) {
    if (tovarName.trim() === "") {
        addField.value = ''
        return
    }

    let div = document.createElement('div')

    div.innerHTML = `<div class="bl-row" data-id="${id}">
                <span class="bl-product">
                    ${tovarName}
                </span>
                <span class="bl-count">
                    <button class="bl-minus ${number === 1 ? 'hide' : ''}" data-tooltip="Зменшити кількість">-</button>
                    <span class="bl-label">${number}</span>
                    <button class="bl-plus" data-tooltip="Збільшити кількість">+</button>
                </span>
                <span class="bl-buttons">
                    <button class="bl-buy" data-tooltip="Якщо товар вже куплено">Куплено</button>
                    <button class="bl-delete" data-tooltip="Видалити товар з кошика">x</button>
                </span>
                <button class="bl-new-buy" data-tooltip="Повернути до списку">Не куплено</button>
            </div>`.trim()
    addField.value = ''
    addField.focus();
    blList.appendChild(div.firstChild)


    unboughtList.insertAdjacentHTML('beforeend',
        `<div class="bl-bought-pr" data-id="${id}"> 
                    <span class="bl-bought-prod-name">
                    ${tovarName}
                    </span>
                    <div class="bl-bought-count">${number}</div>
                </div>`
    )

    let newRow = Array.from(document.getElementsByClassName('bl-row'))
    newRow = newRow.filter(value => value.getAttribute('data-id') == (id))[0]
    const currentId = id


    let minus = newRow.querySelector('.bl-minus')
    let plus = newRow.querySelector('.bl-plus')
    let boughtLeftProd = Array.from(document.getElementsByClassName('bl-bought-pr')).filter(value => value.getAttribute('data-id') == currentId)[0]
    let boughtLeftCount = boughtLeftProd.querySelector('.bl-bought-count')
    let countEl = newRow.querySelector('.bl-label')
    let prodName = newRow.querySelector('.bl-product')
    let buttonsBD = newRow.querySelector('.bl-buttons')
    let buttonsPM = newRow.querySelector('.bl-count')
    let buttonNotBuy = newRow.querySelector('.bl-new-buy')
    buttonNotBuy.hidden = true

    minus.addEventListener('click', () => {
        let count = Number(countEl.textContent)
        if (count === 1) return
        count--
        countEl.textContent = count
        boughtLeftCount.textContent = count

        if (count === 1) toggleHide(minus)
    })

    plus.addEventListener('click', () => {
        let count = Number(countEl.textContent)
        if (count === 1) toggleHide(minus)
        count++
        countEl.textContent = count
        boughtLeftCount.textContent = count

    })

    newRow.querySelector('.bl-buy').addEventListener('click', () => {
        let boughtLeftProd = Array.from(document.getElementsByClassName('bl-bought-pr')).filter(value => value.getAttribute('data-id') == currentId)[0]


        let copyListed = boughtLeftProd.cloneNode(true);

        boughtLeftProd.remove()
        copyListed.querySelector('.bl-bought-count').style.textDecoration = "line-through"
        copyListed.style.textDecoration = "line-through"
        newRow.querySelector('.bl-product').style.textDecoration = "line-through"
        boughtList.appendChild(copyListed)

        buttonsBD.hidden = true
        buttonNotBuy.hidden = false

        plus.hidden = true
        minus.hidden = true
    })

    buttonNotBuy.addEventListener('click', () => {
        plus.hidden = false
        minus.hidden = false

        let boughtLeftProd = document.querySelector(`.bl-bought-pr[data-id="${currentId}"]`)

        boughtLeftProd.remove();
        let copyListed = boughtLeftProd.cloneNode(true)
        copyListed.querySelector('.bl-bought-count').style.textDecoration = "none"
        copyListed.style.textDecoration = "none"
        newRow.querySelector('.bl-product').style.textDecoration = "none"
        unboughtList.appendChild(copyListed)


        buttonsBD.hidden = false
        buttonNotBuy.hidden = true
    })

    newRow.querySelector('.bl-delete').addEventListener('click', () => {
        newRow.remove()
        boughtLeftProd.remove()
    })

    prodName.addEventListener('click', () => {
        if(!buttonNotBuy.hidden)
            return
        let name = prodName.textContent;
        prodName.hidden = true;

        let input = `<input type="text" id="prodInput">`.trim()
        newRow.insertAdjacentHTML('afterbegin', input)
        let prodInput = document.getElementById('prodInput');
        prodInput.value = name.trim()
        prodInput.focus()

        prodInput.addEventListener('focusout', () => {
            prodName.innerHTML = document.getElementById('prodInput').value
            prodInput.remove()
            prodName.hidden = false
        })

        prodInput.addEventListener('input', () => {
            document.querySelector(`.bl-bought-pr[data-id="${currentId}"] > .bl-bought-prod-name`)
                .textContent = prodInput.value
        })

    })


    id++
}

function toggleHide(element) {
    element.classList.toggle('hide');
    element.classList.toggle('show');
}

let tovary = {
    "Помідори": 1,
    "Печиво": 2,
    "Сир": 3
}

for (const tovarName in tovary) {
    addToList(tovarName, tovary[tovarName])
}