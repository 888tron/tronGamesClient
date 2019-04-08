!function() {
    let RouletteStateModel = window.classes.RouletteStateModel;

    class WheelView {

        /**
         * @return {Number}
         * @constructor
         */
        static get DEFAULT_BALL_RADIUS() {
            return 175;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get END_BALL_RADIUS() {
            return 97;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get BALL_MILLISECONDS_ON_ROUND() {
            return 1200;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get NUMBERS_MILLISECONDS_ON_ROUND() {
            return 4000;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get MILLISECONDS_TO_STOP_BALL() {
            return 2500;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get ANGLE_TO_STOP_BALL() {
            return 180;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get ROULETTE_ANGLE_SHIFT_ON_IMAGE() {
            return -2;
        }

        /**
         * @return {Number[]}
         * @constructor
         */
        static get NUMBERS() {
            return [
                13,
                36,
                11,
                30,
                8,
                23,
                10,
                5,
                24,
                16,
                33,
                1,
                20,
                14,
                31,
                9,
                22,
                18,
                29,
                7,
                28,
                12,
                25,
                3,
                26,
                0,
                32,
                15,
                19,
                4,
                21,
                2,
                25,
                17,
                34,
                6,
                27
            ];
        }

        /**
         * Event
         * @return {String}
         */
        static get ANIMATION_COMPLETE_EVENT() {
            return 'ANIMATION_COMPLETE_EVENT';
        }

        /**
         * @param stateModel {window.classes.RouletteStateModel}
         * @param imagesModel {window.classes.ImagesModel}
         * @param resultModel {window.classes.ResultModel}
         * @param canvas {CanvasView}
         */
        constructor(stateModel, imagesModel, resultModel, canvas) {
            this._stateModel = stateModel;
            this._imagesModel = imagesModel;
            this._resultModel = resultModel;
            this._canvas = canvas;

            this._ballTween = null;

            $(this._stateModel).on(RouletteStateModel.CHANGE_EVENT, this._onStateModelChange.bind(this));
        }

        // TODO refactoring this shit
        _onStateModelChange() {
            if (this._stateModel.state === RouletteStateModel.WAITING_RESPONSE) {
                this._alpha = 0;
                this._resultAlpha = 0;
                this._numbersAngle = 360;
                this._ballAngle = 0;
                this._ballRadius = WheelView.DEFAULT_BALL_RADIUS;
                this._startInitialAnimation();
            }
            if (this._stateModel.state === RouletteStateModel.SHOW_RESULT) {
                this._startResultAnimation();
            }
        }

        _removeBallAnimation() {
            if (this._ballTween) TWEEN.remove(this._ballTween);
            this._ballTween = null;
        }

        _removeBallRadiusAnimation() {
            if (this._ballRadiusTween) TWEEN.remove(this._ballRadiusTween);
            this._ballRadiusTween = null;
        }

        _removeNumbersAnimation() {
            if (this._numbersTween) TWEEN.remove(this._numbersTween);
            this._numbersTween = null;
        }

        _startInitialAnimation() {
            this._removeBallAnimation();
            this._removeNumbersAnimation();
            new TWEEN.Tween(this)
                .to({_alpha: 1}, 300)
                .start();
            this._numbersTween = new TWEEN.Tween(this)
                .to({_numbersAngle: 0}, WheelView.NUMBERS_MILLISECONDS_ON_ROUND)
                .repeat(Infinity)
                .start();
            this._ballTween = new TWEEN.Tween(this)
                .to({_ballAngle: 360}, WheelView.BALL_MILLISECONDS_ON_ROUND)
                .repeat(Infinity)
                .start();
        }

        _startResultAnimation() {
            this._ballAngleAfterStop = this._ballAngle + WheelView.ANGLE_TO_STOP_BALL - this._getAngleByResult();
            this._numbersAngleAfterStop = this._numbersAngle -
                360 / WheelView.NUMBERS_MILLISECONDS_ON_ROUND * WheelView.MILLISECONDS_TO_STOP_BALL;
            this._angleToSync = this._getAngleToSync(this._numbersAngleAfterStop, this._ballAngleAfterStop);
            this._ballSpeed = 360 / WheelView.BALL_MILLISECONDS_ON_ROUND;
            this._numbersSpeed = 360 / WheelView.NUMBERS_MILLISECONDS_ON_ROUND;
            this._totalSpeed = this._ballSpeed + this._numbersSpeed;
            this._timeToSync = this._angleToSync / this._totalSpeed;

            let ballAngleNew = this._ballAngle + this._timeToSync * this._ballSpeed;
            let numbersAngleNew = this._numbersAngle - this._timeToSync * this._numbersSpeed;

            this._removeBallAnimation();
            this._removeNumbersAnimation();
            new TWEEN.Tween(this)
                .to({_ballAngle: ballAngleNew, _numbersAngle: numbersAngleNew}, this._timeToSync)
                .onComplete(() => {
                    let ballAngleEnd = ballAngleNew + WheelView.ANGLE_TO_STOP_BALL;
                    let numbersAngleEnd = numbersAngleNew -
                        360 / WheelView.NUMBERS_MILLISECONDS_ON_ROUND * WheelView.MILLISECONDS_TO_STOP_BALL;
                    this._ballTween = new TWEEN.Tween(this)
                        .to({_ballAngle: ballAngleEnd}, WheelView.MILLISECONDS_TO_STOP_BALL)
                        .easing(TWEEN.Easing.Cubic.Out)
                        .start();
                    this._ballRadiusTween = new TWEEN.Tween(this)
                        .to({_ballRadius: WheelView.END_BALL_RADIUS}, WheelView.MILLISECONDS_TO_STOP_BALL)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .start();
                    new TWEEN.Tween(this)
                        .to({_numbersAngle: numbersAngleEnd}, WheelView.MILLISECONDS_TO_STOP_BALL)
                        .onComplete(() => {
                            this._removeBallRadiusAnimation();
                            this._removeBallAnimation();
                            this._removeNumbersAnimation();
                            this._ballTween = new TWEEN.Tween(this)
                                .to({_ballAngle: ballAngleEnd - 360, _numbersAngle: numbersAngleEnd - 360}, WheelView.NUMBERS_MILLISECONDS_ON_ROUND)
                                .repeat(Infinity)
                                .start();
                        })
                        .start();
                })
                .start();

            let circleTween = new TWEEN.Tween(this)
                .to({_resultAlpha: 1}, 300)
                .delay(4500).onUpdate(function(object) {
                    console.log(object._resultAlpha);
                });
            circleTween.start();

            new TWEEN.Tween(this)
                .to({_alpha: 0, _resultAlpha: 0}, 300)
                .delay(6500)
                .onComplete(() => {
                    $(this).trigger(WheelView.ANIMATION_COMPLETE_EVENT);
                })
                .start();
        }

        /**
         * Returns the distance in degrees that a circle and a ball must pass together to sync.
         * Ball spin clockwise;
         * Circle of numbers spin counter-clockwise;
         * @param numberAngle {Number} Example:
         *     330
         * @param ballAngle {Number} Example:
         *     300
         * @return {Number} Example:
         *     10
         * @private
         */
        _getAngleToSync(numberAngle, ballAngle) {
            numberAngle = this._normalizeAngle(numberAngle);
            ballAngle = this._normalizeAngle(ballAngle);
            let angle = numberAngle - ballAngle;
            return this._normalizeAngle(angle);
        }

        /**
         * Return angle between 0 and 360.
         * @param angle {Number} Example:
         *     -455
         * @return {Number} Example:
         *     265
         * @private
         */
        _normalizeAngle(angle) {
            return (angle % 360 + 360) % 360;
        }

        /**
         * Return angle for result slot on Circle of numbers.
         * @return {Number}
         * @private
         */
        _getAngleByResult() {
            return WheelView.NUMBERS.indexOf(this._resultModel.number) * 360 / WheelView.NUMBERS.length + WheelView.ROULETTE_ANGLE_SHIFT_ON_IMAGE;
        }

        update() {
            this._updateVail();
            this._updateWheelStatic();
            this._updateWheelNumbers();
            this._updateWheelBall();
            this._updateWheelLightMap();
            this._updateResult();
        }

        _updateVail() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this._canvas.context.fillRect(0, 0, this._canvas.canvas.width, this._canvas.canvas.height);
            this._canvas.context.restore();
        }

        _updateWheelStatic() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelStatic.png'), (this._canvas.canvas.width - 480) / 2, 0, 480, 480);
            this._canvas.context.restore();
        }

        _updateWheelNumbers() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.translate(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2);
            this._canvas.context.rotate(this._numbersAngle * Math.PI / 180);
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelNumbers.png'), -240, -240, 480, 480);
            this._canvas.context.restore();
        }

        _updateWheelBall() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.translate(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2);
            this._canvas.context.rotate(this._ballAngle * Math.PI / 180);
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelBall.png'), -15, -this._ballRadius - 15, 30, 30);
            this._canvas.context.restore();
        }

        _updateWheelLightMap() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelLightMap.png'), (this._canvas.canvas.width - 480) / 2, 0, 480, 480);
            this._canvas.context.restore();
        }

        _updateResult() {
            if (this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._resultAlpha;
            this._canvas.context.fillStyle = this._resultModel.win ? 'rgba(0, 170, 0, 0.9)' : 'rgba(170, 0, 0, 0.9)';
            this._canvas.context.beginPath();
            this._canvas.context.arc(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2, 88, 0, 2 * Math.PI);
            this._canvas.context.fill();

            this._canvas.context.font = '100px bold Helvetica';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.fillText(this._resultModel.number, this._canvas.canvas.width / 2, this._canvas.canvas.height / 2 + 30);

            let text = this._resultModel.win ? 'WIN' : 'NO WIN';
            this._canvas.context.font = '18px bold Helvetica';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, this._canvas.canvas.height / 2 + 70);

            this._canvas.context.restore();
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.WheelView = WheelView;
}();