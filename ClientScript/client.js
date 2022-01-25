'use strict';



function FetchPost(URL, params) {
    return new Promise((resolve, reject) => {
        const jqxhr = $.post({
            type: 'POST',
            url: URL,
            dataType: 'json',
            success: dataRes => {
                if (dataRes.Error) {
                    if (dataRes.Error.includes('reconnect')) {
                        $('#Step2Contents').css('height', '10em');
                    };
                    reject(new Error(dataRes.Error));
                } else {
                    resolve(dataRes);
                };
            },
            data: params
        }).fail((jqxhr, err) => {
            reject(err);
        });
    });
};


let SecurityToken;


let NextSpinnerID = 10000;

function CreateSpinner(IDtoAppendTo) {
    const spinnerID = `spinner${NextSpinnerID++}`;
    const spinnerHTML = `
<div id='${spinnerID}' class='lds-spinner' style='display: inline-block;'>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>`;
    $(`#${IDtoAppendTo}`).append(spinnerHTML);
    return spinnerID;
};



function KillSpinner(SpinnerID) {
    $(`#${SpinnerID}`).remove();
};



async function RunSQL() {
    $('#SQLRun').prop('disabled', true);
    $('#SQLStmt').prop('disabled', true);
    $('#Step3Spinner').css('display', 'inline-block');

    try {
        const myResults = await FetchPost('/run', {
            Action: 'RunSQL',
            SecurityToken: SecurityToken,
            SQLStmt: $('#SQLStmt').val().trim()
        });

        $('#SQLResults').val(JSON.stringify(myResults, null, 3));
    } catch (err) {
        alert(err.message);
    } finally {
        $('#SQLRun').prop('disabled', false);
        $('#SQLStmt').prop('disabled', false);
        $('#Step3Spinner').css('display', 'none');
    };
};


$(() => {
    console.log('Demo started');

    // MZMZ: Bypass
    //   $('#Step2Contents').css('height', '10em');


    $('#SaveCRT').click(() => {
        $('#SaveCRT').prop('disabled', true);
        $('#Step1Spinner').css('display', 'inline-block');

        FetchPost('/run', {
            Action: 'SaveCRT',
            CRTFile: $('#ClientRootCRT').val()
        }).then(dataJSON => {
            $('#ConnectDB').prop('disabled', false);
        }).catch(err => {
            alert(err.message);
        }).finally(() => {
            $('#Step1Spinner').css('display', 'none');
            $('#Step1Header').css('color', 'lightgreen');
            $('#SaveCRT').prop('disabled', false);
            $('#check01').css('opacity', 1);
            $('#Step1Contents').css('height', 0);
            $('#Step2Contents').css('height', '10em');
        });
    });

    $('#ConnectDB').click(() => {
        $('#ConnectDB').prop('disabled', true);
        $('#Step2Spinner').css('display', 'inline-block');

        FetchPost('/run', {
            Action: 'Connect',
            ConnectionString: $('#CRDB_Connection_String').val()
        }).then(dataJSON => {
            SecurityToken = dataJSON.SecurityToken;
        }).catch(err => {
            alert(err.message);
        }).finally(() => {
            $('#Step2Spinner').css('display', 'none');
            $('#Step2Header').css('color', 'lightgreen');
            $('#ConnectDB').prop('disabled', false);
            $('#check02').css('opacity', 1);
            $('#Step2Contents').css('height', 0);
            $('#Step3Contents').css('height', '23em');
            $('#Step4Contents').css('height', '23em');
        });
    });


    $('#SQLStmt').on('keypress', e => {
        if (e.which === 13) {
            RunSQL();
        };
    });

    $('#SQLRun').click(() => RunSQL());

    $('#RecreateTableBtn').click(async() => {
        $('#RecreateTableBtn').prop('disabled', true);
        const spinnerID = CreateSpinner('RecreateTableDiv');
        try {
            const myResults = await FetchPost('/run', {
                Action: 'RecreateTable',
                SecurityToken: SecurityToken
            });
        } catch (err) {
            alert(err.message);
        } finally {
            KillSpinner(spinnerID);
            $('#RecreateTableBtn').prop('disabled', false);
        };
    });

    $('#CreateRows').click(async() => {
        $('#CreateRows').prop('disabled', true);
        const spinnerID = CreateSpinner('Create100Div');
        try {
            const myResults = await FetchPost('/run', {
                Action: 'Create100',
                SecurityToken: SecurityToken,
                SQLStmt: $('#SQLStmt').val().trim()
            });
        } catch (err) {
            alert(err.message);
        } finally {
            KillSpinner(spinnerID);
            $('#CreateRows').prop('disabled', false);
        };
    });

    let RunTheQueries = false;
    let QueryCount = 0;
    let RowCount = 0;

    $('#RandomQueryStop').prop('disabled', true);

    $('#RandomQueryStop').click(async() => {
        RunTheQueries = false;
    });

    $('#RandomQueryStart').click(async() => {
        QueryCount = 0;
        RowCount = 0;
        RunTheQueries = true;
        $('#RandomQueryStart').prop('disabled', true);
        $('#RandomQueryStop').prop('disabled', false);
        const spinnerID = CreateSpinner('RandomQueryStartDiv');
        try {
            while (RunTheQueries) {
                const myResults = await FetchPost('/run', {
                    Action: 'RandomQuery',
                    SecurityToken: SecurityToken
                });
                RowCount += myResults.rows.length;
                $('#RandomResultBox').html(`Queries issued: ${QueryCount++}, accumulated rows: ${RowCount}`);
            };
        } catch (err) {
            alert(err.message);
        } finally {
            RunTheQueries = false;
            QueryCount = 0;
            KillSpinner(spinnerID);
            $('#RandomQueryStart').prop('disabled', false);
            $('#RandomQueryStop').prop('disabled', true);
        };
    });


});