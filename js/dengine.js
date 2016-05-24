/**
 * Objeto que gestiona los eventos internos del juego.
 * @class
 */
var Dengine = {
  capas: {},
  ctx: {},
  stackItems: [],
  stackCollision: [],
  camera: 0,
  pixValue: 5,
  time: 150,
  edit: false,

  /**
   * Carga las capas necesarias para poder funcionar, en caso contrario lanza una excepcion.
   */
  boot: function() {
    var layer = ['cancer', 'ecuador', 'capricornio'];
    try {
      for (var l in layer) {
        this.capas[layer[l]] = document.getElementById(layer[l]);
        this.ctx[layer[l]] = this.capas[layer[l]].getContext('2d');
        this.ctx[layer[l]].canvas.width = this.capas[layer[l]].offsetWidth;
        this.ctx[layer[l]].canvas.height = this.capas[layer[l]].offsetHeight;
      }
    } catch (err) {
      console.error("Faltan capas.");
    }
  },

  /**
   * Setter de pixValue que gestiona el "tamaño" de los pixeles del juego.
   * @param {number} pixValue - Nuevo valor de un pixel.
   */
  setPixelValue: function(pixValue) {
    this.pixValue = pixValue;
  },

  /**
   * Setter de time que gestiona el los fps.
   * @param {number} time - Nuevo tiempo entre frames.
   */
  setTime: function(time) {
    this.time = time;
  },

  /**
   * Carga los objetos que estarán en el juego.
   * @param {Item} item - "POJO" con los datos del modelo.
   */
  addItemToLoad: function(item) {
    this.stackItems.push(item);
  },

  /**
   * Mira que únicamente exista un "actor".
   */
  lookIfMore1Camera: function() {
    var count = 0;
    $.each(this.stackItems, function(i, v) {
      if (v.camera) count++;
      if (count > 1) return -1;
    });
  },

  /**
   * Pinta una escena. Gestiona la superposición de capas.
   */
  startGame: function() {
    this.edit = false;
    var item = $.grep(this.stackItems, function(e) {
      return e.camera == true;
    });

    Dengine.camera = item[0].calcFooterPix();
    var layer = 'ecuador';

    this.lookIfMore1Camera();

    Dengine.collisionItem = [];

    this.stackItems.forEach(function(e, i, a) {
      if (e.calcFooterPix() < Dengine.camera) layer = 'cancer';
      else if (e.calcFooterPix() == Dengine.camera) layer = 'ecuador';
      else if (e.calcFooterPix() > Dengine.camera) layer = 'capricornio';

      Dengine.ctx[layer].save();
      Dengine.ctx[layer].translate(e.translatePos[0] * Dengine.pixValue, e.translatePos[1] * Dengine.pixValue);
      e.bodyItem[e.animationPointer][e.spritePointer].forEach(function(e, i, a) {
        Dengine.ctx[layer].strokeStyle = e.C;
        Dengine.ctx[layer].fillStyle = e.C;
        Dengine.ctx[layer].beginPath();
        Dengine.ctx[layer].fillRect(e.X * Dengine.pixValue, e.Y * Dengine.pixValue, Dengine.pixValue, Dengine.pixValue);
        Dengine.ctx[layer].closePath();
        Dengine.ctx[layer].stroke();
      });
      // console.log("Sprite " + e.spritePointer + " Of " + Object.keys(e.bodyItem[e.animationPointer]).length);
      if (e.spritePointer < Object.keys(e.bodyItem[e.animationPointer]).length - 1) e.spritePointer += 1;
      else e.spritePointer = 0;
      Dengine.ctx[layer].restore();
    });
  },

  /**
   * Mira que el "actor" en la próxima animación no traspase una colisión.
   * @return {boolean} r - Determina si existe una colisión.
   */
  lookCollisionItem: function() {
    var item = $.grep(this.stackItems, function(e) {
      return e.camera == true
    });
    this.stackCollision = $.grep(this.stackItems, function(e) {
      return e.camera == false
    });

    var overX = false;
    var overY = false;
    var r = false;

    var auxSprite = [0, 0];
    if (item[0].spritePointer < Object.keys(item[0].collisionItem[item[0].animationPointer]).length - 1) auxSprite[0] = item[0].spritePointer + 1;
    else auxSprite[0] = 0;

    this.stackCollision.forEach(function(e, i, a) {
      if (e.spritePointer < Object.keys(e.collisionItem[e.animationPointer]).length - 1) auxSprite[1] = e.spritePointer + 1;
      else auxSprite[1] = 0;

      for (var l in e.collisionItem[e.animationPointer][auxSprite[1]]) {
        for (var n in item[0].collisionItem[item[0].animationPointer][auxSprite[0]]) {
          // console.log(item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n]);
          // console.log(e.collisionItem[e.animationPointer][auxSprite[1]][l]);
          if ((item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].X + item[0].translatePos[0]) <=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].X  + e.translatePos[0]) &&
            (item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].toX  + item[0].translatePos[0]) >=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].X  + e.translatePos[0])) overX = true;
          if ((item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].X + item[0].translatePos[0]) <=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].toX + e.translatePos[0]) &&
            (item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].toX + item[0].translatePos[0]) >=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].toX + e.translatePos[0])) overX = true;
          if ((item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].Y + item[0].translatePos[1]) <=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].Y + e.translatePos[1]) &&
            (item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].toY + item[0].translatePos[1]) >=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].Y + e.translatePos[1])) overY = true;
          if ((item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].Y + item[0].translatePos[1]) <=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].toY + e.translatePos[1]) &&
            (item[0].collisionItem[item[0].animationPointer][auxSprite[0]][n].toY + item[0].translatePos[1]) >=
            (e.collisionItem[e.animationPointer][auxSprite[1]][l].toY + e.translatePos[1])) overY = true;
          if (overX && overY) {
            if(item[0].hasOwnProperty('callbackCollision')) item[0].callbackCollision();
            if(e.hasOwnProperty('callbackCollision')) e.callbackCollision();
            r = true;
            break;
          }
        }
      }
    });

    return r;
  },

  /**
   * Mueve el entrono del jugador.
   * @param {number} dir - Dirección de movimiento.
   */
  movePlayer: function(dir) {
    if (this.edit) return;
    else this.edit = true;
    var items = $.grep(this.stackItems, function(e) {
      return e.camera == false
    });
    var mov = [];

    var item = $.grep(this.stackItems, function(e) {
      return e.camera == true
    });
    if(item[0].hasOwnProperty('callbackMove')) item[0].callbackMove();

    if (dir == 0) mov = [1, -1];
    else if (dir == 1) mov = [0, 1];
    else if (dir == 2) mov = [1, 1];
    else if (dir == 3) mov = [0, -1];

    for (var i in items) {
      if(items[i].hasOwnProperty('callbackMove')) items[i].callbackMove();
      items[i].translatePos[mov[0]] += mov[1];
    }

    if (this.lookCollisionItem()) {
      for (var i in items) {
        items[i].translatePos[mov[0]] -= mov[1];
      }
    }
  },

  /**
   * Limpia una escena.
   */
  clearAll: function() {
    var layer = ['cancer', 'ecuador', 'capricornio'];

    for (var l in layer) {
      Dengine.ctx[layer[l]].beginPath();
      Dengine.ctx[layer[l]].clearRect(0, 0, Dengine.ctx[layer[l]].canvas.width, Dengine.ctx[layer[l]].canvas.height);
      Dengine.ctx[layer[l]].closePath();
      Dengine.ctx[layer[l]].stroke();
    }
  }
}
