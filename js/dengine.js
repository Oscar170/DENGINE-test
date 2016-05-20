var dengine = {
  capas: {},
  ctx: {},
  stackItems: [],
  stackCollision: [],
  camera: 0,
  pixValue: 5,
  time: 1000,

  boot: function() {
    var layer = ['cancer', 'ecuador', 'capricornio'];
    try {
      for(var l in layer) {
        this.capas[layer[l]] = document.getElementById(layer[l]);
        this.ctx[layer[l]] = this.capas[layer[l]].getContext('2d');
        this.ctx[layer[l]].canvas.width = this.capas[layer[l]].offsetWidth;
        this.ctx[layer[l]].canvas.height = this.capas[layer[l]].offsetHeight;
      }
    } catch (err) {
      console.error("Faltan capas.");
    }
  },

  setPixelValue: function(pixValue) {
    this.pixValue = pixValue;
  },

  setTime: function(time) {
    this.time = time;
  },

  addItemToLoad: function(item) {
    this.stackItems.push(item);
  },

  lookIfMore1Camera: function() {
    var count = 0;
    $.each(this.stackItems, function(i, v) {
      if (v.camera) count++;
      if (count > 1) console.log("bumm");
    });
  },

  starGame: function() {
    var item = $.grep(this.stackItems, function(e) {
      return e.camera == true;
    });
    dengine.camera = item[0].calcFooterPix();
    var layer = 'ecuador';

    this.lookIfMore1Camera();

    this.stackItems.forEach(function(e, i, a) {
      if (e.calcFooterPix() < dengine.camera) layer = 'cancer';
      else if (e.calcFooterPix() == dengine.camera) layer = 'ecuador';
      else if (e.calcFooterPix() > dengine.camera) layer = 'capricornio';

      if (!e.camera) e.collisionItem.forEach(function(e, i, a) {
        dengine.stackCollision.push(e)
      });
      dengine.ctx[layer].save();
      dengine.ctx[layer].translate(e.translatePos[0] * dengine.pixValue, e.translatePos[1] * dengine.pixValue);
      e.bodyItem.forEach(function(e, i, a) {
        dengine.ctx[layer].strokeStyle = e.C;
        dengine.ctx[layer].fillStyle = e.C;
        dengine.ctx[layer].beginPath();
        dengine.ctx[layer].fillRect(e.X * dengine.pixValue, e.Y * dengine.pixValue, dengine.pixValue, dengine.pixValue);
        dengine.ctx[layer].closePath();
        dengine.ctx[layer].stroke();
      });
      dengine.ctx[layer].restore();
    });
  },

  lookCollisionItem: function() {
    var item = $.grep(this.stackItems, function(e) {return e.camera == true});
    var overX = false;
    var overY = false;
    var r = false;
    this.stackCollision.forEach(function(e, i, a) {
      for (var n in item[0].collisionItem) {
        if (item[0].collisionItem[n].X <= e.X && item[0].collisionItem[n].toX >= e.X) overX = true;
        if (item[0].collisionItem[n].X <= e.toX && item[0].collisionItem[n].toX >= e.toX) overX = true;
        if (item[0].collisionItem[n].Y <= e.Y && item[0].collisionItem[n].toY >= e.Y) overY = true;
        if (item[0].collisionItem[n].Y <= e.toY && item[0].collisionItem[n].toY >= e.toY) overY = true;
        if (overX && overY) r = true;
      }
    });

    return r;
  },

  movePlayer: function(dir) {
    var items = $.grep(this.stackItems, function(e) {return e.camera == true});
    var mov = [];

    if (dir == 0) mov = [1, 'Y', 'toY', -1];
    else if (dir == 1) mov = [0, 'X', 'toX', 1];
    else if (dir == 2) mov = [1, 'Y', 'toY', 1];
    else if (dir == 3) mov = [0, 'X', 'toX', -1];

    for (var i in items) {
      items[i].translatePos[mov[0]] += mov[3];
      for (var c in items[i].collisionItem) {
        items[i].collisionItem[c][mov[1]] += mov[3];
        items[i].collisionItem[c][mov[2]] += mov[3];
      }
    }

    if (this.lookCollisionItem()) {
      for (var i in items) {
        items[i].translatePos[mov[0]] -= mov[3];
        for (var c in items[i].collisionItem) {
          items[i].collisionItem[c][mov[1]] -= mov[3];
          items[i].collisionItem[c][mov[2]] -= mov[3];
        }
      }
    }
    this.clearAll();
    this.starGame();
  },
  clearAll: function() {
    var layer = ['cancer', 'ecuador', 'capricornio'];

    for (var l in layer) {
      dengine.ctx[layer[l]].beginPath();
      dengine.ctx[layer[l]].clearRect(0, 0, dengine.ctx[layer[l]].canvas.width, dengine.ctx[layer[l]].canvas.height);
      dengine.ctx[layer[l]].closePath();
      dengine.ctx[layer[l]].stroke();
    }
  }
}
