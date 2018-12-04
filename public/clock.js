export class Clock {
    constructor() {
        this.eventClock = new Event('Clock')
        this.eventClick = new Event('Click')
    }

    clock() {
        dispatchEvent(this.eventClock)
    }

    click() {
        dispatchEvent(this.eventClick)
    }

    stop() {
        this.eventClock.stopPropagation();
    }
}
