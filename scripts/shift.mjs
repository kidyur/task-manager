class Shift {
    #element   = HTMLDivElement;
    #leftBlock = HTMLDivElement;
    #name      = "";
    #input     = HTMLInputElement;
    #iconURL   = "";
    
    constructor() {
        const shiftEl = document.createElement('div');
        shiftEl.className = 'shift shift--editing';
        this.#element = shiftEl;

        const leftBlock = document.createElement('div');
        leftBlock.className = 'shift__left-block';
        this.#leftBlock = leftBlock;
        shiftEl.appendChild(leftBlock);
        
        shiftEl.addEventListener('click', () => {
            this.select();
        })

        this.createIconsField();
        this.createInput();
        this.createDeleteBtn();
        this.appendToShiftsList();
    }

    createInput() {
        const input = document.createElement('input');
        input.className = 'shift__input';
        input.maxLength = 24;
        input.placeholder = "Введите название смены";
        input.addEventListener('blur', () => {
            this.#name = input.value;
        })
        input.focus();
        this.#input = input;
        this.#leftBlock.appendChild(input);
    }

    createDeleteBtn() {
        const btn = document.createElement('button');
        btn.className = 'shift__delete-btn';
        btn.addEventListener('click', () => {
            SchedulesData.currentSchedule.removeShift(this);
            const shiftList = document.getElementById('schedule-page__shift-list');
            shiftList.removeChild(this.#element);
            calendar.update();
        })
        this.#leftBlock.appendChild(btn);
    }

    createIconsField() {
        const iconPaths = [
            'books.svg',
            'moon_and_sun.svg',
            'moon.svg',
            'notebook.svg',
            'plant.svg',
            'sleep.svg',
            'student.svg',
            'sun_and_moon.svg',
            'sun.svg',
            'sunset.svg'
        ];
        const field = document.createElement('div');
        field.className = 'shift__right-block';
        for (const path of iconPaths) {
            const btn = document.createElement('button');
            btn.className = 'shift__icon';
            btn.style.backgroundImage = 'url(../icons/' + path + ')';
            btn.addEventListener('click', () => {
                this.iconURL = 'url(../icons/' + path + ')';
                const prevIcon = field.getElementsByClassName('shift__icon--first')[0];
                if (prevIcon) {
                    prevIcon.className = 'shift__icon';
                }
                btn.className = 'shift__icon shift__icon--first';
                calendar.update();
            })
            field.appendChild(btn);
        }
        this.#element.appendChild(field);
    }

    appendToShiftsList() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.appendChild(this.#element);
    }

    select() {
        offLastActiveShift();
        this.#element.className = 'shift shift--editing';
        this.#input.focus();
    }
}

function offLastActiveShift() {
    const shift = document.getElementsByClassName('shift--editing')[0];
    if (shift) {
        shift.className = 'shift';
    }
}

export default Shift;