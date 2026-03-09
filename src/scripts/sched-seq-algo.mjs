import DateData from "./dateData.mjs";
import SchedulesData from "./schedulesData.mjs";

function getFirstShiftIdxOfCurrMonth() {
    const schedulesData = new SchedulesData();
    if (schedulesData.currentSchedule == null) return -1;
	const shifts = schedulesData.currentSchedule.getShiftsCopy();
    if (shifts.length == 1) return 0; 
    if (shifts.length == 0) return -1;

	const MILISEC_IN_DAY = 24 * 60 * 60 * 1000;
	const seq = [];
    const scheduleMonthBeginningDate = schedulesData.currentSchedule.getBeginningDate();
    scheduleMonthBeginningDate.setDate(1);
    scheduleMonthBeginningDate.setHours(0, 0, 0, 0);

    const dateData = new DateData();
    const monthFmt = (dateData.month < 10 ? '0': '') + dateData.month;
    const monthBeginning = new Date(`${dateData.year}-${monthFmt}-01`);
    
    const gap = Math.floor((monthBeginning - scheduleMonthBeginningDate) / MILISEC_IN_DAY);
    const beginningDate = schedulesData.currentSchedule.getBeginningDate();
    let remainder = (beginningDate.getDate()) % shifts.length;

    let idx = shifts.indexOf(schedulesData.currentSchedule.getBeginningShift());

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