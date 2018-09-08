export default class {
  Data () {
    let mode = 'kick' // eslint-disable-line no-unused-vars
    let intervalo = 6 // eslint-disable-line no-unused-vars
  }
  getMode () {
    return this.mode
  }
  setMode (mode) {
    this.mode = mode
  }
  getIntervalo () {
    return this.intervalo
  }
  setIntervalo (intervalo) {
    switch (intervalo) {
      case 'fast':
        this.intervalo = 4
        break
      case 'medium':
        this.intervalo = 6
        break
      case 'slow':
        this.intervalo = 8
        break
      default:
        break
    }
  }
}
