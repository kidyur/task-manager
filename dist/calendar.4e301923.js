function openPage(pageToOpenId) {
    const pages = [
        'calendar-page',
        'schedule-page',
        'tasks-page'
    ];
    for (const pageId of pages){
        const page = document.getElementById(pageId);
        if (pageToOpenId == pageId) {
            page.style.display = 'flex';
            page.style.visibility = 'unset';
            page.style.pointerEvents = 'all';
        } else {
            page.style.display = 'none';
            page.style.visibility = 'hidden';
            page.style.pointerEvents = 'none';
        }
    }
}
function setupFooterButtons() {
    const pages = [
        'calendar-page',
        'schedule-page',
        'tasks-page'
    ];
    for (const pageId of pages){
        const buttonId = 'open-' + pageId + '-btn';
        const button = document.getElementById(buttonId);
        button.addEventListener('click', ()=>openPage(pageId));
    }
}
document.addEventListener('DOMContentLoaded', ()=>{
    setupFooterButtons();
// openPage('schedule-page');
});

//# sourceMappingURL=calendar.4e301923.js.map
