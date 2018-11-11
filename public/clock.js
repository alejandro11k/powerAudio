export class Clock {
    constructor() {
        this.event = new Event('Clock')
    }

    click() {
        dispatchEvent(this.event)
    }

    stop() {
        this.event.stopPropagation();
    }
}
