!function() {
    let ShowFirstTimeChecker = window.classes.ShowFirstTimeChecker;
    let ChipsNavigationView = window.classes.ChipsNavigationView;
    let CanvasView = window.classes.CanvasView;
    let GameView = window.classes.GameView;
    let RouletteSpinButtonNavigationView = window.classes.RouletteSpinButtonNavigationView;

    class RouletteRootView {

        /**
         * @param model {RouletteRootModel}
         */
        constructor(model) {
            this._chipsNavigation = new ChipsNavigationView(model.chipsNavigation, '.roulette-navigation-chip-xxxx-js', 'xxxx');
            this._spinButtonNavigation = new RouletteSpinButtonNavigationView(model.state, '#spinRouletteButton');
            this._checker = new ShowFirstTimeChecker('#rouletteCanvas');
            let canvas = new CanvasView('#rouletteCanvas');
            this._game = new GameView(model, canvas);
        }

        /**
         * @return {ChipsNavigationView}
         */
        get chipsNavigation() {
            return this._chipsNavigation;
        }

        /**
         * @return {RouletteSpinButtonNavigationView}
         */
        get spinButtonNavigation() {
            return this._spinButtonNavigation;
        }

        /**
         * @return {GameView}
         */
        get game() {
            return this._game;
        }

        /**
         * @return {ShowFirstTimeChecker}
         */
        get checker() {
            return this._checker;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteRootView = RouletteRootView;
}();