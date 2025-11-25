import SchedulesData from "./schedulesData.mjs";
import Schedule from "./schedule.mjs";
import Calendar from "./calendar.mjs";

class Shift {
    #element   = HTMLDivElement;
    #leftBlock = HTMLDivElement;
    #name      = "";
    #input     = HTMLInputElement;
    
    #iconURL   = "";
    get iconURL() { return this.#iconURL };
    
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

    static setupAddShiftBtn() {
        const btn = document.getElementById('schedule-page__add-shift-btn');
        btn.addEventListener('click', () => {
            const shift = new Shift();
            SchedulesData.currentSchedule.addShift(shift);
            Shift.offLastActiveShift();
            shift.select();
            Calendar.update();
        })
    }

    static updateCreateShiftBtn() {
        const btn = document.getElementById('schedule-page__add-shift-btn');
        if (SchedulesData.getSchedulesLength() >= 1) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    }

    static offLastActiveShift() {
        const shift = document.getElementsByClassName('shift--editing')[0];
        if (shift) {
            shift.className = 'shift';
        }
    }

    createInput() {
        const input = document.createElement('input');
        input.className = 'shift__input';
        input.maxLength = 24;
        input.placeholder = "День";
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
                this.#iconURL = 'url(../icons/' + path + ')';
                const prevIcon = field.getElementsByClassName('shift__icon--first')[0];
                if (prevIcon) {
                    prevIcon.className = 'shift__icon';
                }
                btn.className = 'shift__icon shift__icon--first';
                Calendar.update();
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
        Shift.offLastActiveShift();
        this.#element.className = 'shift shift--editing';
        this.#input.focus();
    }
}

export default Shift;