!function() {
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;
    let ChipsNavigationView = window.classes.ChipsNavigationView;

    class ChipsNavigationController {

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
            $(document).ready(this._init.bind(this));
        }

        _init() {
            this._model = new ChipsNavigationModel(ChipsNavigationController.CHIPS);
            this._chipsNavigationView = new ChipsNavigationView(this._model, '.roulette-navigation-chip-xxxx-js', 'xxxx');
            $(this._chipsNavigationView).on(ChipsNavigationView.CLICK_EVENT, this._onChipsNavigationViewClick.bind(this));
        }

        /**
         * @param [event] {Object}
         * @param index {Number}
         * @private
         */
        _onChipsNavigationViewClick(event, index) {
            this._model.index = index;
        }
    }

    new ChipsNavigationController();
}();