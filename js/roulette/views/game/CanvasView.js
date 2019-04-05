!function() {
    class CanvasView {

        /**
         * @return {Number}
         * @constructor
         */
        static get DEFAULT_WIDTH() {
            return 960;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get DEFAULT_HEIGHT() {
            return 480;
        }

        /**
         * @param canvas {String} Example:
         *     '#canvas'
         */
        constructor(canvas) {
            this._needResize = true;
            this._canvas = $(canvas).get(0);
            this._context = this._canvas.getContext('2d');
            this._canvas.width = CanvasView.DEFAULT_WIDTH;
            this._canvas.height = CanvasView.DEFAULT_HEIGHT;
            this._shiftX = 0;
            $(window).resize(this._onWindowResize.bind(this));
        }

        updateSize() {
            if (!this._needResize) return;
            this._resize();
            this._needResize = false;
        }

        clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }

        /**
         * @return {Boolean}
         */
        get visible() {
            return Boolean($(this._canvas).is(':visible'));
        }

        /**
         * @return {HTMLElement}
         */
        get canvas() {
            return this._canvas;
        }

        /**
         * @return {CanvasRenderingContext2D}
         */
        get context() {
            return this._context;
        }

        /**
         * @return {Number}
         */
        get shiftX() {
            return this._shiftX;
        }

        _onWindowResize() {
            this._needResize = true;
        }

        _resize() {
            let width = $(this._canvas).width();
            if (width >= CanvasView.DEFAULT_WIDTH) {
                $(this._canvas).height(CanvasView.DEFAULT_HEIGHT);
                this._canvas.width = width;
                this._shiftX = width - CanvasView.DEFAULT_WIDTH / 2;
            }
            else {
                let canvasElementHeight = width * CanvasView.DEFAULT_HEIGHT / CanvasView.DEFAULT_WIDTH;
                $(this._canvas).height(canvasElementHeight);
                this._canvas.width = CanvasView.DEFAULT_WIDTH;
                this._shiftX = 0;
            }
            this._needResize = false;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.CanvasView = CanvasView;
}();