(function () {
    $('#cardsSelect .range').val('26');
})();

$('#cardsSelect .range').on('input', function() {
    var select = $(this).val();
    var card = cardType(select);
    $('#selectedCardImg').attr('src', 'img/cards/' + select + '.svg');
    $('#curentCard').html(card);
    $('#cardsSelect .range-tooltip').html(card);
    var left = 100/53*(parseInt(select)+1);
    $('#cardsSelect .range-thumb').css('left', 'calc(' + left + '% - 13px');
    $('#cardsSelect .range-track').css('background', 'linear-gradient(to right, #01f593 ' + left + '%, #ff026c ' + left + '%)');
});

$('.range-select > div').on('click', function () {
    $('.range-select').find('.active').removeClass('active');
    $(this).addClass('active');
    $('#curentDraw').html($('.range-select > div.active').html());
});

function loadCard() {
    $('.load-card').removeClass('d-none').addClass('d-flex');
}

function showCard(card) {
    $('.load-card').removeClass('d-flex').addClass('d-none');
    $('#resultCard').attr('src', 'img/cards/' + card + '.svg');
    $('.card-3d').addClass('show');
}

function resetCard() {
    $('.card-3d').removeClass('show');
}

function showCardText() {
    $('.card-container').addClass('showtext');
    $('.card-container .text-block').html('WINS<br>100000 TRX');
    setTimeout(function(){$('.card-container').removeClass('showtext');}, 2000);
}

function cardType(card) {
    var sign;
    var value;
    var style;
    switch(parseInt(card)){
        case 0:
            sign = 'spades';
            value = '2';
            break;
        case 1:
            sign = 'clover';
            value = '2';
            break;
        case 2:
            sign = 'diamond';
            value = '2';
            break;
        case 3:
            sign = 'hearts';
            value = '2';
            break;
        case 4:
            sign = 'spades';
            value = '3';
            break;
        case 5:
            sign = 'clover';
            value = '3';
            break;
        case 6:
            sign = 'diamond';
            value = '3';
            break;
        case 7:
            sign = 'hearts';
            value = '3';
            break;
        case 8:
            sign = 'spades';
            value = '4';
            break;
        case 9:
            sign = 'clover';
            value = '4';
            break;
        case 10:
            sign = 'diamond';
            value = '4';
            break;
        case 11:
            sign = 'hearts';
            value = '4';
            break;
        case 12:
            sign = 'spades';
            value = '5';
            break;
        case 13:
            sign = 'clover';
            value = '5';
            break;
        case 14:
            sign = 'diamond';
            value = '5';
            break;
        case 15:
            sign = 'hearts';
            value = '5';
            break;
        case 16:
            sign = 'spades';
            value = '6';
            break;
        case 17:
            sign = 'clover';
            value = '6';
            break;
        case 18:
            sign = 'diamond';
            value = '6';
            break;
        case 19:
            sign = 'hearts';
            value = '6';
            break;
        case 20:
            sign = 'spades';
            value = '7';
            break;
        case 21:
            sign = 'clover';
            value = '7';
            break;
        case 22:
            sign = 'diamond';
            value = '7';
            break;
        case 23:
            sign = 'hearts';
            value = '7';
            break;
        case 24:
            sign = 'spades';
            value = '8';
            break;
        case 25:
            sign = 'clover';
            value = '8';
            break;
        case 26:
            sign = 'diamond';
            value = '8';
            break;
        case 27:
            sign = 'hearts';
            value = '8';
            break;
        case 28:
            sign = 'spades';
            value = '9';
            break;
        case 29:
            sign = 'clover';
            value = '9';
            break;
        case 30:
            sign = 'diamond';
            value = '9';
            break;
        case 31:
            sign = 'hearts';
            value = '9';
            break;
        case 32:
            sign = 'spades';
            value = '10';
            break;
        case 33:
            sign = 'clover';
            value = '10';
            break;
        case 34:
            sign = 'diamond';
            value = '10';
            break;
        case 35:
            sign = 'hearts';
            value = '10';
            break;
        case 36:
            sign = 'spades';
            value = 'J';
            break;
        case 37:
            sign = 'clover';
            value = 'J';
            break;
        case 38:
            sign = 'diamond';
            value = 'J';
            break;
        case 39:
            sign = 'hearts';
            value = 'J';
            break;
        case 40:
            sign = 'spades';
            value = 'Q';
            break;
        case 41:
            sign = 'clover';
            value = 'Q';
            break;
        case 42:
            sign = 'diamond';
            value = 'Q';
            break;
        case 43:
            sign = 'hearts';
            value = 'Q';
            break;
        case 44:
            sign = 'spades';
            value = 'K';
            break;
        case 45:
            sign = 'clover';
            value = 'K';
            break;
        case 46:
            sign = 'diamond';
            value = 'K';
            break;
        case 47:
            sign = 'hearts';
            value = 'K';
            break;
        case 48:
            sign = 'spades';
            value = 'A';
            break;
        case 49:
            sign = 'clover';
            value = 'A';
            break;
        case 50:
            sign = 'diamond';
            value = 'A';
            break;
        case 51:
            sign = 'hearts';
            value = 'A';
            break;
    }
    return '<svg class="icon white"><use xlink:href="img/cards/cards-sprite.svg#' + sign + '"></use></svg><span>' + value + '</span>';
}

