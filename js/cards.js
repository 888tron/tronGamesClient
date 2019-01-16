(function () {
    $('#cardsSelect').val('6');
})();

$('#cardsSelect').on('input', function() {
    var select = $(this).val();
    $('#selectedCardImg').attr('src', 'img/cards/' + select + '.svg');
    $('.cards-list').find('.active').removeClass('active');
    $('.cards-list > div').eq(select).addClass('active');
    $('#curentCard').html($('.cards-list > div.active').html());
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