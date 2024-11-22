const inputEl = (document.getElementsByClassName('app__controls-input'))[0];
const btnEl = (document.getElementsByClassName('app__controls-button'))[0];
const listEl = (document.getElementsByClassName('app__list'))[0];
let counter = 1;

function loadData() { /*загрузка данных из локального хранилища браузера*/
    const savedData = localStorage.getItem('tasks');
    return savedData ? JSON.parse(savedData) : [];
}

const data = loadData(); /*возвращает либо массив задач, сохранённых в локальном хранилище, либо пустой массив, если данных нет*/

data.forEach((item) => {  /*перебирает каждый элемент массива data, передавая текущий элемент в качестве аргумента функции*/
    if (item.id >= counter) { /*проверяет, если идентификатор текущего элемента (item.id) больше или равен значению переменной counter*/
        counter = item.id + 1;
    }
});

/* сохрание текущего массива задач в локальном хранилище в формате JSON */
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(data));
}

// создание элементов интерфейса для задачи 
function createTask(objectData) { /*'createTask' предназначена для создания элемента задачи в пользовательском интерфейсе*/
    const root = document.createElement('div');
    root.classList.add('app__list-item');

    if (objectData.isDone) { /*если задача выполнена (isDone), добавляется соответствующий класс*/
        root.classList.add('app__list-item_done');
    }

    const input = document.createElement('input'); /*создание элемента чекбокса; он позволяет отметить задачу как выполненную:*/
    input.classList.add('app__list-checkbox');
    input.type = 'checkbox';

    if (objectData.isDone) {
        input.checked = true;
    }

    const txt = document.createElement('p'); /*создание текстового элемента*/
    txt.classList.add('app__list-item-text');
    txt.innerText = objectData.text;

    const btn = document.createElement('button'); /*создание кнопки удаления*/
    btn.classList.add('app__list-btn');

    const img = document.createElement('img')
    img.src = './Vector.png'
    img.alt = 'trash'
    img.width = 30

    btn.appendChild(img); //добавление изображения в кнопку

    btn.addEventListener('click', (event) => { /*обработка события для удаления задачи; При нажатии на кнопку удаления вызывается функция deleteTask*/
        event.stopPropagation();
        deleteTask(objectData.id);
    });

    root.addEventListener('click', () => toggleTaskState(objectData.id)); // addEventListener добавляет обработчик события клика на корневой элемент задачи (root)
    // toggleTaskState отвечает за переключение состояния выполнения задачи

    root.appendChild(input); /*элементы добавляются в корневой элемент*/
    root.appendChild(txt);
    root.appendChild(btn);

    return root;
}


// функция удаления задач
function deleteTask(id) { /*функция принимает идентификатор задачи (id) и ищет индекс этой задачи в массиве data с помощью метода findIndex. Если задача найдена, возвращается её индекс, иначе возвращается -1.*/
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) { //если индекс не равен -1, это означает, что задача существует в массиве
        data.splice(index, 1); //если задача найдена, она удаляется из массива с помощью метода splice, который изменяет содержимое массива, удаляя или добавляя элементы.
        saveData(); /*сохранение текущего состояния данных*/
        render(); /*обновляет отображение задач на экране*/
    }
}

//функция переключения состояния задачи:
function toggleTaskState(id) { /*функция обновляет статус задачи и пользовательский интерфейс*/
    const task = data.find(item => item.id === id); /*Функция принимает идентификатор задачи (id) и ищет соответствующий объект в массиве data с помощью метода find.
    Если задача найдена, то возвращается объект задачи, иначе возвращается undefined*/
    if (task) { /*Если задача найдена (то есть переменная task не равна undefined), происходит изменение её состояния*/
        task.isDone = !task.isDone; /*Статус выполнения задачи (isDone) переключается на противоположный с помощью логического оператора "!"*/
        saveData(); /*сохраняет текущее состояние данных */
        render(); /*обновление интерфейса*/
    }
}

//обработчик события для добавления новой задачи
btnEl.addEventListener('click', () => { /*обработчик события click добавляется на элемент кнопки btnEl*/
    const textValue = inputEl.value;
    data.push({
        id: counter++,
        text: textValue,
        isDone: false
    });
    saveData();
    render();

    inputEl.value = ''; /*после добавления задачи поле ввода очищается*/
});

//вывод на экран и обновление
function render() {
    listEl.innerHTML = ''; /*очистка списка задач*/
    for (let item of data) { /*функция проходит по каждому элементу массива data, представляющему задачи*/
        const tmpEl = createTask(item); /*для каждого элемента массива вызывается функция createTask, которая создает HTML-элемент для задачи*/
        listEl.appendChild(tmpEl); /*Созданный элемент задачи добавляется в элемент списка (listEl)*/
    }
}

render(); 
