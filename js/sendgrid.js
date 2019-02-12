function sendToSendgrid() {

    const email = $(".sendGridEmail").val();

    log('sendToSendgrid', email);

    post('/api/subscribe', {email: email})
        .then(data => {
            logLine('sendToSendgrid', data);

            $(".sendGridEmail").val('');

            $('#alertModal').modal();

        })
        .catch(err => {

            logError('sendToSendgrid', err);

            return delay(5000).then(() => {
                return sendToSendgrid();
            });
        });

}