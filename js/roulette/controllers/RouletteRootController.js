!function() {
    let ShowFirstTimeChecker = window.classes.ShowFirstTimeChecker;
    let RouletteStateModel = window.classes.RouletteStateModel;
    let RouletteRootModel = window.classes.RouletteRootModel;
    let RouletteRootView = window.classes.RouletteRootView;
    let ChipsNavigationController = window.classes.ChipsNavigationController;
    let SpinController = window.classes.SpinController;
    let ImagesLoader = window.classes.ImagesLoader;
    let RouletteImagesLoader = window.classes.RouletteImagesLoader;

    class RouletteRootController {

        /**
         * @return {Number[]}
         */
        static get CHIPS() {
            return [
                10,
                20,
                50,
                100,
                250,
                1000
            ];
        }

        constructor() {
            this._imagesLoader = new RouletteImagesLoader();
            this._model = new RouletteRootModel(RouletteRootController.CHIPS);
            this._view = new RouletteRootView(this._model);
            new ChipsNavigationController(this._model.chipsNavigation, this._view.chipsNavigation);
            new SpinController(this._model.state, this._model.result, this._view.spinButtonNavigation, this._view.game.wheel);
            this._checkFirstShow();
        }

        /**
         * Wait first game show.
         * @private
         */
        _checkFirstShow() {
            $(this._view.checker).on(ShowFirstTimeChecker.SHOW_FIRST_TIME_EVENT, this._onShowFirstTime.bind(this));
            this._view.checker.check();
        }

        /**
         * Load images.
         * @private
         */
        _onShowFirstTime() {
            $(this._imagesLoader).on(ImagesLoader.COMPLETE_EVENT, this._onImagesLoaderComplete.bind(this));
            this._imagesLoader.load();
        }

        /**
         * Start game timer.
         * @private
         */
        _onImagesLoaderComplete() {
            this._model.state.state = RouletteStateModel.GAME;
            this._model.images.setLoader(this._imagesLoader);
            requestAnimationFrame(this._update.bind(this));
        }

        /**
         * Execute every frame.
         * @private
         */
        _update() {
            this._view.game.update();
            requestAnimationFrame(this._update.bind(this));
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteRootController = RouletteRootController;
}();