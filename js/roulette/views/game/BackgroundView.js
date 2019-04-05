!function() {
    class BackgroundView {

        /**
         * @param canvas {CanvasView}
         */
        constructor(canvas) {
            this._canvas = canvas;
        }

        update() {
            let canvas = this._canvas.canvas;
            let context = this._canvas.context;

            let gradient = context.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#020');
            gradient.addColorStop(1, '#140');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.BackgroundView = BackgroundView;
}();