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

    const WriteBlockDemoSetup = [
        'DROP TABLE IF EXISTS t;',
        'CREATE TABLE t (k INT PRIMARY KEY, v INT);',
        'INSERT INTO t VALUES (1,1),(2,2),(3,3);'
    ];

    const WritesBlockDemoSQL = [
        ['Trans 1 (write)', 'Trans 2 (read)', 'Trans 3 (write)'],
        ['begin;', '', ''],
        ['UPDATE t SET v=2012 WHERE k=2;', 'BEGIN;'],
        ['', 'SELECT * FROM t WHERE k=2;', 'BEGIN;'],
        ['', '', 'UPDATE t SET v=2032 WHERE k=2;'],
        ['COMMIT;', '', ''],
        ['', 'COMMIT;', 'COMMIT;'],
    ];

    
    const myRowString = [];
    WritesBlockDemoSQL.forEach((rowOfText, index) => {
        myRowString.push('<tr>');
        if (index === 0) {
            rowOfText.forEach(cellText => {
                myRowString.push(`<th>${cellText}</th>`);
            });
        } else {
            rowOfText.forEach(cellText => {
                myRowString.push(`<td>${cellText}</td>`);
            });
        };
        myRowString.push('</tr>');
    });
    const WritesBlockDemoTable = $('#writes_block_demo');
    WritesBlockDemoTable.append(myRowString.join(''));


    $('#SQLRun').click(() => RunSQL());

});
