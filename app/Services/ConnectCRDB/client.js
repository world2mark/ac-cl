'use strict';



$(() => {


    $('#ConnectDB').click(() => {
        $('#ConnectDB').prop('disabled', true);
        const mySpinnerInstanceJQ = CreateSpinnerOnTopOf('#ConnectDB');

        FetchPost('/connect_crdb?id=connect', {
            ConnectionString: $('#CRDB_Connection_String').val(),
            CRTData: $('#ClientRootCRT').val()
        }).then(dataJSON => {
            alert('Connected!');
        }).catch(err => {
            alert(err.message);
        }).finally(() => {
            mySpinnerInstanceJQ.remove();
            $('#ConnectDB').prop('disabled', false);
        });
    });


});
