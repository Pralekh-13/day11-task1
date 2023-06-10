class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  addListener(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  removeListener(eventName, callback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        listener => listener !== callback
      );
    }
  }

  emit(eventName, data) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(callback => {
        callback(data);
      });
    }
  }

  propagateEvent(eventName, data, target, direction) {
    let currentElement = target;

    while (currentElement !== null) {
      this.emit(eventName, { data, target: currentElement });

      if (direction === 'up') {
        currentElement = currentElement.parentNode;
      } else if (direction === 'down') {
        const childElements = currentElement.querySelectorAll('*');
        childElements.forEach(child => {
          this.emit(eventName, { data, target: child });
        });
        currentElement = null;
      }
    }
  }
}
const eventEmitter = new EventEmitter();

const button = document.querySelector('.button');


button.addEventListener('click', () => {
  eventEmitter.emit('buttonClick', 'Button was clicked!');
});


eventEmitter.addListener('buttonClick', ({ data, target }) => {
  console.log(`Event propagated: ${data}`);
  console.log('Target element:', target);
});

eventEmitter.propagateEvent('buttonClick', 'Upward event propagation', button, 'up');


eventEmitter.propagateEvent('buttonClick', 'Downward event propagation', button, 'down');
