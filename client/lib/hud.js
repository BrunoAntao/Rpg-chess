class Label {

    constructor(scene, index = 0, label = '', color = '#000000', textcolor = '#ffffff') {

        this.index = index

        this.label = label;
        this.color = color;
        this.textcolor = textcolor;

        scene.ctx.fillStyle = this.color;
        scene.ctx.fillRect(16 , 16 + 16 * this.index + 32 * this.index, 128, 32);
        scene.ctx.fillStyle = this.textcolor;
        scene.ctx.font = '16px arial';
        scene.ctx.fillText(this.label, 32, 32 + 16 * this.index + 32 * this.index, 128, 32);

    }

}