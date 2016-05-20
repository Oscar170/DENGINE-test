class Item {
  constructor(x, y, focus) {
    this.translatePos = [x, y];
    this.bodyItem = [];
    this.collisionItem = [];
    this.camera = focus;
    this.footerPix = 0;
  }

  loadItem(mod) {
    var splitAux = null;
    for (var k in mod[0]) {
      splitAux = k.split(",");
      this.bodyItem.push({
        'X': splitAux[0],
        'Y': splitAux[1],
        'C': mod[0][k]
      });
      if (splitAux[1]*1 > this.footerPix) this.footerPix = splitAux[1]*1;
    }

    for (var k in mod[1]) {
      splitAux[0] = k.split(",");
      splitAux[1] = mod[1][k].split(",");
      this.collisionItem.push({
        'X': splitAux[0][0] * 1 + this.translatePos[0] * 1,
        'Y': splitAux[0][1] * 1 + this.translatePos[1] * 1,
        'toX': splitAux[1][0] * 1 + this.translatePos[0] * 1,
        'toY': splitAux[1][1] * 1 + this.translatePos[1] * 1
      });
    }
  }

  calcFooterPix() {
    return this.footerPix + this.translatePos[1];
  }
}
