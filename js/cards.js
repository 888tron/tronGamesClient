cardInit();

function cardInit() {

    loadImages();

    app.drawRange = 0;
    app.cardIndex = 24;

    app.minCardIndex = 1;
    app.maxCardIndex = 50;
    updateCardMinMax();
    $('#cardsSelect .range').val(app.cardIndex);
    onSelectCard();
};

function loadImages() {
    app.cardImages = [];

    for (let i = 0; i < 52; i++) {
        const img = new Image();
        img.src = 'img/cards/' + i + '.svg';

        app.cardImages[i] = img;
    }

    const img = new Image();
    img.src = 'img/cards/cover.png';
    app.cardImageCover = img;
}

function onSelectCard() {
    app.cardIndex = parseInt($('#cardsSelect .range').val());
    if (app.cardIndex < app.minCardIndex) {
        app.cardIndex = app.minCardIndex;
        $('#cardsSelect .range').val(app.cardIndex);
    }
    if (app.cardIndex > app.maxCardIndex) {
        app.cardIndex = app.maxCardIndex;
        $('#cardsSelect .range').val(app.cardIndex);
        log(app.cardIndex)
    }

    var card = cardType(app.cardIndex);
    $('#selectedCardImg').attr('src', 'img/cards/' + app.cardIndex + '.svg');
    $('#curentCard').html(card);
    $('#cardsSelect .range-tooltip').html(card);
    var left = 100 / 53 * (app.cardIndex + 1);
    $('#cardsSelect .range-thumb').css('left', 'calc(' + left + '% - 13px');
    $('#cardsSelect .range-track').css('background', 'linear-gradient(to right, #01f593 ' + left + '%, #ff026c ' + left + '%)');


    updateChances();

    log('app.cardIndex', app.cardIndex + ' (' + cardTypeText(app.cardIndex) + ')');

    resetCard();
}

function updateChances() {
    const cardsCount = 52;
    const houseEdge = 0.035;

    const betAmount = app.betAmount;

    const betValue = app.cardIndex;

    let winMult = 0;
    let winChance = 0;

    if (app.drawRange === 0) {
        winChance = (cardsCount - 1 - betValue) / cardsCount;
        winMult = (1 - houseEdge) / winChance;

    } else if (app.drawRange === 1) {
        winChance = 1 / cardsCount;
        winMult = (1 - houseEdge) / winChance;

    } else {
        winChance = betValue / cardsCount;
        winMult = (1 - houseEdge) / winChance;
    }
    const winAmount = betAmount * winMult;

    $('.payoutText').html(winAmount.toFixed(4) + ' TRX');
    $('.chanceText').html((winChance * 100).toFixed(2) + '%');
    $('.multiplayerText').html(winMult.toFixed(4) + 'X');
}

$('#cardsSelect .range').on('input', onSelectCard);

$('.range-select > div').on('click', function () {
    if (!$(this).hasClass('disabled')) {
        $('.range-select').find('.active').removeClass('active');
        $(this).addClass('active');
        $('#curentDraw').html($('.range-select > div.active').html());

        app.drawRange = 2 - $('.range-select > div.active').index();

        if (app.drawRange === 1) {
            app.minCardIndex = 0;
            app.maxCardIndex = 51;
        } else {
            app.minCardIndex = 1;
            app.maxCardIndex = 50;
        }

        updateCardMinMax();

        onSelectCard();
    }
});

function updateCardMinMax() {
    $('#cardsSelect .range').attr('min', app.minCardIndex);
    $('#cardsSelect .range').attr('max', app.maxCardIndex);
}

function loadCard() {
    $('.load-card').removeClass('d-none').addClass('d-flex');
}

function loadCardStop() {
    $('.load-card').removeClass('d-flex').addClass('d-none');
}

function showCard(card) {
    loadCardStop();

    $('.card-3d').addClass('show');

    const resultCard = $('.result-card');

    resultCard.html(app.cardImages[card]);
}

function hideWinText() {
    $('.card-container .text-block').removeClass('winTextAnimation');
    $('.card-container').removeClass('showtext');
}

function resetCard() {
    hideWinText();
    $('.card-3d').removeClass('show');

    setTimeout(() => {
        const resultCard = $('.result-card');
        resultCard.html('');
    }, 1000);
}

function showCardText(winAmount) {
    $('.card-container').addClass('showtext');
    $('.card-container .text-block').html('WINS ' + (winAmount === 0 ? 0 : winAmount.toFixed(2)) + ' TRX');
    $('.card-container .text-block').addClass('winTextAnimation');

}

function cardType(card) {
    return '<svg class="icon white mr-1"><use xlink:href="img/cards/cards-sprite.svg#' +
        ['spades', 'clover', 'diamond', 'hearts'][card % 4]
        + '"></use></svg><span>' +
        ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][Math.floor(card / 4)]
        + '</span>';
}

function cardTypeText(card) {
    return ['♠', '♣', '♦', '♥'][card % 4] + ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][Math.floor(card / 4)];
}

function cardTypeHistory(card, color) {
    return '<svg class="icon  ' + color + ' mr-1"><use xlink:href="img/cards/cards-sprite.svg#' +
        ['spades', 'clover', 'diamond', 'hearts'][card % 4]
        + '"></use></svg><span class="' + color + '">' +
        ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][Math.floor(card / 4)]
        + '</span>';
}

function disableControls() {
    $('.control-panel').find('.btn').addClass('disabled').attr("disabled", "disabled");
    $('.control-panel').find('.form-control').attr("disabled", "disabled");
    $('.range-select').find('div').addClass('disabled')
    $('#cardsSelect').find('input').attr("disabled", "disabled");
    $('#myHeader .nav-tabs').find('.navbar-brand').addClass('disabled');

}

function enableControls() {
    $('.control-panel').find('.btn').removeClass('disabled').removeAttr("disabled");
    $('.control-panel').find('.form-control').removeAttr("disabled");
    $('.range-select').find('div').removeClass('disabled')
    $('#cardsSelect').find('input').removeAttr("disabled");
    $('#myHeader .nav-tabs').find('.navbar-brand').removeClass('disabled');
}

function showMinBetTooltip(value){
	var target = $('#Games .tab-pane.active').find('.betAmount');
    target.tooltip();
    if(value){
        target.tooltip('enable');
        target.tooltip('show');
		setTimeout(function(){
			target.tooltip('hide');
		}, 5000);
        target.tooltip('disable');
    } else {
        target.tooltip('enable');
        target.tooltip('hide');
        target.tooltip('disable');
    }
}


