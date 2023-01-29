import './style.css';
import _ from 'underscore';

//2C = 2 de Clubs (treboles)
//2D = 2 de Diaminds (diamantes)
//2H = 2 de Hearts (corazones)
//2S = 2 de Spades (espadas)

//PATRON MODULO
//es el que se hace con la funcion anonima autoinvocada y se ejecuta ni bien se carga la aplicacion o web. De esta forma no se puede acceder a la variable desde la consola del navegador

//funcion anonima autoinvocada
const miModulo = (() => {
  'use strict' //el uso estricto conviene habilitarlo al usar patron modulo

  
  let mazo = [];
  const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K']; //se declaran varias constantes de esta forma

  let puntosJugadores = [];
  // let puntosJugador = 0,
  //     puntosComputadora = 0;

  //Referencias del HTML
  const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

  const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');

  //Esta funcion inicializa el juego
  const inicializarJuego = (numJugadores = 2) =>{
      mazo = crearMazo();
      puntosJugadores=[];
      //console.log({numJugadores});
      for(let i = 0; i<numJugadores; i++){
          puntosJugadores.push(0);
      }
      
      console.clear();
      
      puntosHTML.forEach( elemento => elemento.innerText = 0 );
      // puntosHTML[0].innerText = 0;
      // puntosHTML[1].innerText = 0;
      divCartasJugadores.forEach( elemento => elemento.innerHTML = '' );
      btnPedir.disabled = false;
      btnDetener.disabled = false;
  }
   

  //Esta funcion crea un nuevo mazo
  const crearMazo = () => {

      mazo = [];
      for (let i = 2; i <= 10; i++) {
          //mazo.push(i+'C')
          for (let tipo of tipos) {
              mazo.push(i + tipo)
          }
      }

      for (let tipo of tipos) {
          for (let esp of especiales) {
              mazo.push(esp + tipo)
          }
      }

      //console.log(mazo);
      //mazo = _.shuffle(mazo);
      //console.log(mazo);
      //return mazo;

      return _.shuffle(mazo);

  }

  
  

  //Esta funcion me permite tomar una carta

  const pedirCarta = () => {
      if (mazo.length === 0) {
          throw 'No hay cartas en el mazo'
      } else {
          //let carta = mazo.shift();
          // console.log(carta);
          // console.log(mazo);
          //return carta;
          return mazo.shift();
      }

  }


  //pedirCarta();

  //Esta funcion sirve para obtener valor de la carta
  const valorCarta = (carta) => {

      const valor = carta.substring(0, carta.length - 1); //de esta forma extraemos el ultimo valor del arreglo que se que es una letra y me quedo con el primero o primeros numeros

      return (isNaN(valor)) ?
          (valor === 'A') ? 11 : 10
          : parseInt(valor);

      //let puntos = 0;
      //console.log({valor})
      // if(isNaN(valor)){
      //     //no es un numero
      //     //console.log('no es un numero')
      //     puntos = (valor === 'A') ? 11 : 10;
      // }else{
      //     //es un numero
      //     //console.log('es un numero')
      //     puntos = parseInt(valor);
      // }
      // console.log(puntos);
  }

  // let valor = valorCarta(pedirCarta());
  // console.log({valor});

  //Turno: 0 = primer jugador y el ultimo sera la computadora
  const acumularPuntos = (carta, turno) => {
      puntosJugadores[turno] += valorCarta(carta);
      puntosHTML[turno].innerText = puntosJugadores[turno];
      return puntosJugadores[turno];

  }

  const crearCarta = (carta, turno)=>{
      const imgCarta = document.createElement('img');
      imgCarta.src = `assets/cartas/${carta}.png`;
      //imgCarta.className = 'carta';
      //Otra forma de agregar CLASS
      imgCarta.classList.add('carta');
      divCartasJugadores[turno].append(imgCarta);
  }

  const determinarGanador = ()=>{
      const [puntosMinimos, puntosComputadora] = puntosJugadores; //desestructuracion de arreglos
      setTimeout(() => {
          if ((puntosComputadora === puntosMinimos)) {
              alert('Nadie gana');
          } else if ((puntosMinimos > 21)) {
              alert('Computadora gana');
          } else if (puntosComputadora > 21) {
              alert('Jugador gana');
          } else {
              alert('Computadora gana');
          }
      }, 500);
  }


  //TURNO DE LA COMPUTADORA
  const turnoComputadora = (puntosMinimos) => {
      let puntosComputadora = 0;
      do {
          const carta = pedirCarta();
          // puntosComputadora += valorCarta(carta);
          // puntosHTML[1].innerText = puntosComputadora;

          puntosComputadora = acumularPuntos(carta, puntosJugadores.length -1);

          crearCarta(carta, puntosJugadores.length-1);

          // const imgCarta = document.createElement('img');
          // imgCarta.src = `assets/cartas/${carta}.png`;
          //imgCarta.className = 'carta';
          //Otra forma de agregar CLASS
          // imgCarta.classList.add('carta');
          // divCartasComputadora.append(imgCarta);

          

      } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

      determinarGanador();

  }


  //Eventos

  btnPedir.addEventListener('click', () => {

      const carta = pedirCarta();
      // puntosJugador += valorCarta(carta);
      // puntosHTML[0].innerText = puntosJugador;
      const puntosJugador = acumularPuntos(carta, puntosJugadores.length - 2);

      crearCarta(carta, puntosJugadores.length-2);

      // const imgCarta = document.createElement('img');
      // imgCarta.src = `assets/cartas/${carta}.png`;
      //imgCarta.className = 'carta';
      //Otra forma de agregar CLASS
      //imgCarta.classList.add('carta');
      //divCartasJugadores.append(imgCarta);

      if (puntosJugador > 21) {
          console.warn('Lo siento mucho, perdiste');
          btnPedir.disabled = true;
          turnoComputadora(puntosJugador);
      } else if (puntosJugador === 21) {
          console.warn('21, genial!');
          btnPedir.disabled = true;
          turnoComputadora(puntosJugador);
      }
  });

  btnDetener.addEventListener('click', () => {
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugadores[0]);
      //console.log(puntosJugadores[0]);
      

  });

  btnNuevo.addEventListener('click', () => {
      
      inicializarJuego();      
      

      //crearMazo();
  });


  //turnoComputadora(15);

  //return 'Hola Mundo';
  return {
      nuevoJuego: inicializarJuego
  };

})();


// (function(){ ESTA FUNCION ES LA MISMA QUE LA DE ARRIBA EN FORMA

// })();



