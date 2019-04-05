!function() {
    let ChipsNavigationView = window.classes.ChipsNavigationView;

    class ChipsNavigationController {

        /**
         * @param model {window.classes.ChipsNavigationModel}
         * @param view {ChipsNavigationView}
         */
        constructor(model, view) {
            this._model = model;
            this._view = view;
            $(this._view).on(ChipsNavigationView.CLICK_EVENT, this._onChipsNavigationViewClick.bind(this));
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

    if (!window.classes) window.classes = {};
    window.classes.ChipsNavigationController = ChipsNavigationController;
}();