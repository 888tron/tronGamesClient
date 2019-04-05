!function() {
    let BackgroundView = window.classes.BackgroundView;
    let WheelView = window.classes.WheelView;

    class GameView {

        /**
         * @param rootModel {RouletteRootModel}
         * @param canvas {CanvasView}
         */
        constructor(rootModel, canvas) {
            this._canvas = canvas;
            this._background = new BackgroundView(canvas);
            this._wheel = new WheelView(rootModel.state, rootModel.images, rootModel.result, canvas);
        }

        update() {
            if (!this._canvas.visible) return;
            this._canvas.updateSize();
            this._canvas.clear();
            this._background.update();
            this._wheel.update();
        }

        /**
         * @return {WheelView}
         */
        get wheel() {
            return this._wheel;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.GameView = GameView;
}();