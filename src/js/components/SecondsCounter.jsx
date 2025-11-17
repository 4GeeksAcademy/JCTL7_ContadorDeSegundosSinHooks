
import React, { Component } from 'react';

class SecondsCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      initialTime: 0,
      intervalId: null,
      isRunning: false,
      inputTime: '',
      alertTime: null,
      hasAlerted: false,
      laps: [] 
    };
  }
  
  
  componentWillUnmount() { this.stopTimer(); }
startTimer = () => {
    if (this.state.isRunning) return;
    
    const id = setInterval(() => {
      this.setState(prevState => {
        let newSeconds = prevState.seconds + 1;
        
        // 1. Lógica de Parada Automática 🛑
        if (prevState.initialTime > 0 && newSeconds > prevState.initialTime) {
            // El cronómetro superó el tiempo límite.
            this.stopTimer(); 
            alert(`¡TIEMPO LÍMITE ALCANZADO! El cronómetro se detuvo en ${prevState.initialTime} segundos.`);
            // Devolvemos el estado con el tiempo límite exacto.
            return { seconds: prevState.initialTime };
        }

        // 2. Lógica de Alerta (opcional, si el tiempo límite es diferente al tiempo de alerta)
        if (prevState.alertTime !== null && 
            newSeconds >= prevState.alertTime && 
            !prevState.hasAlerted) {
            
            alert(`¡ALERTA! El tiempo de ${prevState.alertTime} segundos ha sido alcanzado.`);
            this.setState({ hasAlerted: true }); 
        }
        
        return { seconds: newSeconds };
      });
    }, 1000);

    this.setState({ intervalId: id, isRunning: true });
  };

  stopTimer = () => {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.setState({ isRunning: false, intervalId: null });
    }
  };
  
  resumeTimer = () => { this.startTimer(); }

  resetTimer = () => {
    this.stopTimer();
    this.setState({ 
        seconds: 0, 
        hasAlerted: false, 
        laps: [] 
    });
  };

  recordLap = () => {
    if (!this.state.isRunning) return;

    const currentSeconds = this.state.seconds;
    
    this.setState(prevState => ({
        laps: [currentSeconds, ...prevState.laps]
    }));
  };

  handleInputChange = (e) => { this.setState({ inputTime: e.target.value }); };

  setInitialTime = () => {
    let value = parseInt(this.state.inputTime, 10);
    if (isNaN(value) || value <= 0) {
        alert("Por favor, ingresa un número positivo para establecer el tiempo límite.");
        return;
    }
    this.setState({ initialTime: value, inputTime: '' });
    alert(`Tiempo límite o de referencia establecido en: ${value} segundos.`);
  };

  setAlertTime = () => {
    let value = parseInt(this.state.inputTime, 10);
    if (isNaN(value) || value <= 0) {
        alert("El tiempo de alerta debe ser un número positivo.");
        return;
    }
    this.setState({ alertTime: value, hasAlerted: false, inputTime: '' });
    alert(`Alerta configurada para cuando el cronómetro alcance: ${value} segundos.`);
  };

  formatTime = (totalSeconds) => {
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    const mTotal = Math.floor(totalSeconds / 60);
    const m = (mTotal % 60).toString().padStart(2, '0');
    const h = Math.floor(mTotal / 60).toString().padStart(2, '0');
    return (h + m + s).split(''); 
  };
  
  formatLapTime = (totalSeconds) => {
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    const mTotal = Math.floor(totalSeconds / 60);
    const m = (mTotal % 60).toString().padStart(2, '0');
    const h = Math.floor(mTotal / 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };


  render() {
    const { seconds, isRunning, inputTime, initialTime, alertTime, laps } = this.state;
    const digitsArray = this.formatTime(seconds);
    const elements = [];

    elements.push(<div className="digit-box" key="clock-icon"> <i className="fas fa-clock"></i> </div>);
    digitsArray.forEach((digit, index) => {
      if (index === 2 || index === 4) { elements.push(<div key={`sep-${index}`} className="colon">:</div>); }
      elements.push(<div key={`digit-${index}`} className="digit-box">{digit}</div>);
    });

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4 text-white">Contador de Tiempo</h1>
        <div className="seconds-counter-display p-4 rounded shadow-lg d-flex justify-content-center">
          {elements}
        </div>
        <div className="card shadow p-4 mt-4 mb-4 bg-dark text-white border-0">
            <h5 className="mb-3">Configuración de Tiempos</h5>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-4 mb-2"> 
                    <input
                        type="number"
                        value={inputTime}
                        onChange={this.handleInputChange}
                        placeholder="Segundos (ejem., 60)"
                        className="form-control bg-secondary text-white border-secondary"
                    />
                </div>
                <div className="col-12 col-lg-8 d-flex flex-column flex-md-row justify-content-center">
                    <button className="btn btn-primary me-md-3 mb-2 mb-md-0 w-100" onClick={this.setInitialTime}>
                        Establecer Tiempo Límite
                    </button>
                    <button className="btn btn-info w-100" onClick={this.setAlertTime}>
                        Establecer Alerta
                    </button>
                </div>
            </div>
            <p className="mt-3 text-muted text-center">
                Tiempo Límite: **{initialTime}s**. 
                Alerta al alcanzar: **{alertTime !== null ? `${alertTime}s` : 'Ninguna'}**.
            </p>
        </div>
        <div className="text-center mb-4">
            <div className="d-grid gap-2 d-md-block">
                <button 
                    className={`btn me-md-3 px-4 ${isRunning ? 'btn-warning' : 'btn-success'} w-100 w-md-auto mb-2 mb-md-0`} 
                    onClick={isRunning ? this.stopTimer : this.resumeTimer}
                >
                    {isRunning ? '⏸ Parar' : '▶️ Iniciar / Reanudar'}
                </button>
                <button 
                    className="btn btn-danger me-md-3 px-4 w-100 w-md-auto mb-2 mb-md-0" 
                    onClick={this.resetTimer}
                >
                    🔄 Reiniciar (a 00:00:00)
                </button>
                <button 
                    className="btn btn-secondary px-4 w-100 w-md-auto" 
                    onClick={this.recordLap}
                    disabled={!isRunning}
                >
                    🏁 Lap ({laps.length + 1})
                </button>
            </div>
        </div>
        {laps.length > 0 && (
            <div className="card shadow-sm mt-4 bg-dark text-white border-0">
                <div className="card-header bg-secondary text-white border-secondary">
                    Registro de Vueltas
                </div>
                <ul className="list-group list-group-flush">
                    {laps.map((lapTime, index) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary" key={index}>
                            <span className="fw-bold text-info">Vuelta {laps.length - index}:</span>
                            <span className="text-success fs-6 fw-bold">
                                {this.formatLapTime(lapTime)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    );
  }
}

export default SecondsCounter;