import SchedulesData from "./schedulesData.mjs";
import Schedule from "./schedule.mjs";
import Calendar from "./calendar.mjs";

class Shift {
    #element   = HTMLDivElement;
    #name      = "";
    #input     = HTMLInputElement;
    
    #iconURL   = "";
    get iconURL() { return this.#iconURL };
    
    constructor() {
        const shiftEl = document.createElement('div');
        shiftEl.className = 'shift shift--editing';
        this.#element = shiftEl;

        shiftEl.innerHTML = `
            <div class="shift__main">
                <div class="shift__left-block"></div>
                <div class="shift__right-block"></div>
            </div>
            <button class="set-current-day-btn">Дважды кликните на название, чтобы выбрать день текущим</button>
        `

        shiftEl.addEventListener('click', () => {
            this.select();
        })

        this.createIconsField();
        this.createInput();
        this.createDeleteBtn();
        this.appendToShiftsList();

        if (SchedulesData.currentSchedule.beginningShift == Shift) {
            this.tagAsCurrent();
        }
    }

    static offLastActiveShift() {
        const shift = document.getElementsByClassName('shift--editing')[0];
        if (shift) {
            shift.className = 'shift';
        }
    }

    tagAsCurrent() {
        const lastChoice = document.getElementsByClassName('shift_current')[0];
        if (lastChoice) {
            lastChoice.className = 'shift__input';
        }
        this.#input.classList.add('shift_current');
        SchedulesData.currentSchedule.setBeginning(this);
    }

    createInput() {
        const input = document.createElement('input');
        input.className = 'shift__input';
        input.maxLength = 24;
        input.placeholder = "День";
        input.addEventListener('blur', () => {
            this.#name = input.value;
        })
        input.addEventListener('dblclick', () => {
            if (SchedulesData.currentSchedule.beginningShift != this) {
                this.tagAsCurrent();
            }
        })
        input.focus();
        this.#input = input;
        this.#element.getElementsByClassName('shift__left-block')[0].appendChild(input);
    }

    createDeleteBtn() {
        const btn = document.createElement('button');
        btn.className = 'shift__delete-btn';
        btn.addEventListener('click', () => {
            SchedulesData.currentSchedule.removeShift(this);
            const shiftList = document.getElementById('schedule-page__shift-list');
            if (SchedulesData.currentSchedule.beginningShift == this) {
                if (SchedulesData.currentSchedule.getShiftsLength() > 0) {
                    SchedulesData.currentSchedule.beginningShift = SchedulesData.currentSchedule.getShiftsCopy()[0];
                } else {
                    SchedulesData.currentSchedule.beginningShift = Shift;
                }
            }
            shiftList.removeChild(this.#element);
        })
        this.#element.getElementsByClassName('shift__left-block')[0].appendChild(btn);
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
            btn.style.backgroundImage = 'url(./src/icons/' + path + ')';
            btn.addEventListener('click', () => {
                this.#iconURL = 'url(./src/icons/' + path + ')';
                const prevIcon = field.getElementsByClassName('shift__icon--first')[0];
                if (prevIcon) {
                    prevIcon.className = 'shift__icon';
                }
                btn.className = 'shift__icon shift__icon--first';
                Calendar.update();
            })
            field.appendChild(btn);
        }
        this.#element.getElementsByClassName('shift__right-block')[0].appendChild(field);
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