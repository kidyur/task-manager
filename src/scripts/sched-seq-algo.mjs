import DateData from "./dateData.mjs";
import SchedulesData from "./schedulesData.mjs";

function getFirstShiftIdxOfCurrMonth() {
	const shifts = SchedulesData.currentSchedule.getShiftsCopy();
    if (shifts.length == 1) return 0; 
    if (shifts.length == 0) return -1;

	const MILISEC_IN_DAY = 24 * 60 * 60 * 1000;
	const seq = [];
    const scheduleMonthBeginningDate = SchedulesData.currentSchedule.beginningDate;
    scheduleMonthBeginningDate.setDate(1);
    scheduleMonthBeginningDate.setHours(0, 0, 0, 0);

    const monthFmt = (DateData.month < 10 ? '0': '') + DateData.month;
    const monthBeginning = new Date(`${DateData.year}-${monthFmt}-01`);
    
    const gap = Math.floor((monthBeginning - scheduleMonthBeginningDate) / MILISEC_IN_DAY);
    const beginningDate = SchedulesData.currentSchedule.beginningDate;
    let remainder = (beginningDate.getDate()) % shifts.length;
    let idx = shifts.indexOf(SchedulesData.currentSchedule.beginningShift);
    // Мы доводим до того остатка, с которого начнём 
    // заполнять календарь.
    let diff = shifts.length - remainder + 1;
    idx = (idx + diff) % shifts.length;
    for (let i = 0; i < shifts.length; i++) {
        seq.push((idx + i + gap) % shifts.length);
        if (seq[i] < 0) {
            seq[i] = shifts.length + seq[i];
        }
    }
	return seq[0];
}

export { getFirstShiftIdxOfCurrMonth };