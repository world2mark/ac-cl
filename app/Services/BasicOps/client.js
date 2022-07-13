'use strict';


$(() => {

    function RunSQL() {
        $('#SQLRun').prop('disabled', true);
        const mySpinnerInstanceJQ = CreateSpinnerOnTopOf('#SQLRun');

        FetchPost('/basic_ops?id=RunSQL', {
            SQLStmt: $('#SQLStmt').val().trim()
        }).then(myResults => {
            $('#SQLResults').val(JSON.stringify(myResults, null, 3));
        }).catch(err => {
            alert(err.message);
        }).finally(() => {
            $('#SQLRun').prop('disabled', false);
            mySpinnerInstanceJQ.remove();
        });
    };


    $('#SQLStmt').on('keypress', e => {
        if (e.which === 13) {
            RunSQL();
        };
    });

    $('#SQLRun').click(() => RunSQL());

    $('#RecreateTableBtn').click(async () => {
        $('#RecreateTableBtn').prop('disabled', true);
        const mySpinnerInstanceJQ = CreateSpinnerOnTopOf('#RecreateTableBtn');
        try {
            const myResults = await FetchPost('/run', {
                Action: 'RecreateTable',
                SecurityToken: SecurityToken
            });
        } finally {
            mySpinnerInstanceJQ.remove();
            $('#RecreateTableBtn').prop('disabled', false);
        };
    });

    $('#CreateRows').click(async () => {
        $('#CreateRows').prop('disabled', true);
        const mySpinnerInstanceJQ = CreateSpinnerOnTopOf('#CreateRows');
        try {
            const myResults = await FetchPost('/run', {
                Action: 'CreateRows',
                SecurityToken: SecurityToken,
                SQLStmt: $('#SQLStmt').val().trim()
            });
        } finally {
            mySpinnerInstanceJQ.remove();
            $('#CreateRows').prop('disabled', false);
        };
    });

    let RunTheQueries = false;
    let QueryCount = 0;
    let RowCount = 0;

    let loopedQuerySpinner;

    $('#RandomQueryStop').prop('disabled', true);

    $('#RandomQueryStop').click(async () => {
        RunTheQueries = false;
        if (loopedQuerySpinner) {
            loopedQuerySpinner.remove();
            loopedQuerySpinner = null;
        };
    });

    $('#RandomQueryStart').click(async () => {
        QueryCount = 0;
        RowCount = 0;
        RunTheQueries = true;
        $('#RandomQueryStart').prop('disabled', true);
        $('#RandomQueryStop').prop('disabled', false);
        loopedQuerySpinner = CreateSpinnerOnTopOf('#RandomQueryStart');
        try {
            while (RunTheQueries) {
                const myResults = await FetchPost('/run', {
                    Action: 'RandomQuery',
                    SecurityToken: SecurityToken
                });
                RowCount += myResults.rows.length;
                $('#RandomResultBox').html(`Queries issued: ${QueryCount++}, accumulated rows: ${RowCount}`);
            };
        } finally {
            RunTheQueries = false;
            QueryCount = 0;
            $('#RandomQueryStart').prop('disabled', false);
            $('#RandomQueryStop').prop('disabled', true);
        };
    });


});