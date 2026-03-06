import SchedulesData from "./schedulesData.mjs";
import Schedule from "./schedule.mjs";
import Calendar from "./calendar.mjs";

class Shift {
    #element   = undefined;
    #name      = "";
    get name() { return this.#name }

    #iconTag   = "";
    get iconTag() { return this.#iconTag };

    constructor(name="", tag="") {
        this.#render();
        this.#element.addEventListener('click', () => {
            this.select();
        })
        this.createIconsField(tag);
        this.createDeleteBtn();
        this.appendToShiftsList();
        this.#element.querySelector('.shift__input').value = name;
        
        const schedulesData = new SchedulesData();
        if (schedulesData.currentSchedule.beginningShift == Shift) {
            this.tagAsCurrent();
        }

        this.select();
    }

    #render() {
        this.#element = document.createElement('div');
        this.#element.className = 'shift';
        this.#element.innerHTML = `
            <div class="shift__main">
                <div class="shift__left-block">
                    <input class="shift__input" maxlength=24 placeholder="День">
                </div>
                <div class="shift__right-block"></div>
            </div>
            <button class="set-current-day-btn">Дважды кликните на название, чтобы выбрать день текущим</button>
        `;
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
        const schedulesData = new SchedulesData();
        schedulesData.currentSchedule.setBeginning(this);
    }

    createDeleteBtn() {
        const btn = document.createElement('button');
        btn.className = 'shift__delete-btn';
        btn.addEventListener('click', () => {
            const schedulesData = new SchedulesData();

            schedulesData.currentSchedule.removeShift(this);
            const shiftList = document.getElementById('schedule-page__shift-list');
            if (schedulesData.currentSchedule.beginningShift == this) {
                if (schedulesData.currentSchedule.getShiftsLength() > 0) {
                    schedulesData.currentSchedule.beginningShift = schedulesData.currentSchedule.getShiftsCopy()[0];
                } else {
                    schedulesData.currentSchedule.beginningShift = Shift;
                }
            }
            shiftList.removeChild(this.#element);
        })
        
        this.#element.getElementsByClassName('shift__left-block')[0].appendChild(btn);
    }

    createIconsField(iconTag) {
        const iconTags = [
            'books',
            'moon_and_sun',
            'moon',
            'notebook',
            'plant',
            'sleep',
            'student',
            'sun_and_moon',
            'sun',
            'sunset'
        ];
        const field = document.createElement('div');
        field.className = 'shift__right-block';
        for (const tag of iconTags) {
            const btn = document.createElement('button');
            btn.className = 'shift__icon';
            btn.setAttribute('shift-icon', tag);

            if (tag == iconTag) {
                this.#iconTag = tag;
                btn.className = 'shift__icon shift__icon--first';
            }

            btn.addEventListener('click', () => {
                this.#iconTag = tag;
                const prevIcon = field.getElementsByClassName('shift__icon--first')[0];
                if (prevIcon) {
                    prevIcon.className = 'shift__icon';
                }
                btn.className = 'shift__icon shift__icon--first';
                const calendar = new Calendar();
                calendar.updateView();
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
    }
}

export default Shift;