export class PortWorkletNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'processor');
        this.counter = 0;
        this.port.onmessage = this.handleMessage.bind(this);
        this.port.postMessage({
        message: 'Are you ready?',
        timeStamp: this.context.currentTime
        });

        // this.click = new Beeper(new Sound(context, this))

    }

    handleMessage(event) {
        this.counter++;
        console.log('[Node:Received] "' + event.data.message +
                    '" (' + event.data.timeStamp + ')');
        
        // Notify the processor when the node gets 10 messages. Then reset the
        // counter.
        this.click.execute(this)

        if (this.counter > 10) {
        this.port.postMessage({
            message: '10 messages!',
            timeStamp: this.context.currentTime
        });
        this.counter = 0;
        }
    }

    setSound(sound) {
        this.click = sound 
    }
    
}
