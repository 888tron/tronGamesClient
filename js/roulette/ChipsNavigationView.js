!function() {
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;

    class ChipsNavigationView {
        /**
         * Event.
         * @return String
         */
        static get CLICK_EVENT() {
            return 'CLICK_EVENT';
        }

        /**
         * Event.
         * @return String
         */
        static get ACTIVE_CLASS_NAME() {
            return 'active';
        }

        /**
         * @param model {ChipsNavigationModel}
         * @param cssClass {String} Example:
         *     '.roulette-navigation-chip-xxxx-js',
         * @param cssClassPartForReplace {String} Example:
         *     'xxxx'
         */
        constructor(model, cssClass, cssClassPartForReplace) {
            this._model = model;
            this._chips = model;

            for (let i = 0; i < this._model.length; i++) {
                let value = this._model.getValueByIndex(i);
                let className = cssClass.replace(cssClassPartForReplace, value);
                let chip = $(className);
                $(chip).data('index', i);
                $(chip).click(this._onChipClick.bind(this));
                this._chips[i] = chip;
            }

            $(this._model).on(ChipsNavigationModel.CHANGE_EVENT, this._update.bind(this));
            this._update();
        }

        /**
         * @param event {Object}
         * @param event.currentTarget {Object}
         * @private
         */
        _onChipClick(event) {
            let index = $(event.currentTarget).data('index');
            $(this).trigger(ChipsNavigationView.CLICK_EVENT, index);
        }

        _update() {
            for (let i = 0; i < this._model.length; i++) {
                let chip = this._chips[i];
                $(chip).removeClass(ChipsNavigationView.ACTIVE_CLASS_NAME);
            }
            let chip = this._chips[this._model.index];
            $(chip).addClass(ChipsNavigationView.ACTIVE_CLASS_NAME);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ChipsNavigationView = ChipsNavigationView;
}();