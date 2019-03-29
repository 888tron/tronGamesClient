!function()
{
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;
    let ChipsNavigationView = window.classes.ChipsNavigationView;
    let ChipsNavigationButtonsView = window.classes.ChipsNavigationButtonsView;

    class ChipsNavigationController
    {
        /**
         * @return {Number[]}
         */
        static get CHIPS()
        {
            return [
                10,
                20,
                50,
                100,
                250,
                1000
            ];
        }

        constructor()
        {
            $(document).ready(this._init.bind(this));
        }

        _init()
        {
            this._model = new ChipsNavigationModel(ChipsNavigationController.CHIPS);
            this._chipsNavigationView = new ChipsNavigationView(this._model, '.roulette-navigation-chip-xxxx-js', 'xxxx');
            this._chipsNavigationButtonsView = new ChipsNavigationButtonsView
            (
                this._model,
                '.roulette-navigation-previous-button-js',
                '.roulette-navigation-next-button-js'
            );

            $(this._chipsNavigationView).on(ChipsNavigationView.CLICK_EVENT, this._onChipsNavigationViewClick.bind(this));
            $(this._chipsNavigationButtonsView).on(ChipsNavigationButtonsView.CLICK_PREVIOUS_EVENT, this._chipsNavigationButtonsViewPreviousClick.bind(this));
            $(this._chipsNavigationButtonsView).on(ChipsNavigationButtonsView.CLICK_NEXT_EVENT, this._chipsNavigationButtonsViewNextClick.bind(this));
        }

        /**
         * @param [event] {Object}
         * @param index {Number}
         * @private
         */
        _onChipsNavigationViewClick(event, index)
        {
            this._model.index = index;
        }

        _chipsNavigationButtonsViewPreviousClick()
        {
            this._model.previous();
        }

        _chipsNavigationButtonsViewNextClick()
        {
            this._model.next();
        }
    }

    new ChipsNavigationController();
}();