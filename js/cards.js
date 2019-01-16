(function () {
    $('#cardsSelect .range').val('26');
})();

$('#cardsSelect .range').on('input', function() {
    var select = $(this).val();
    $('#selectedCardImg').attr('src', 'img/cards/' + select + '.svg');
    $('#curentCard').html(select);
    $('#cardsSelect .range-tooltip').html(select);
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

