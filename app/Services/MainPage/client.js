'use strict';



function FetchPost(URL, params) {
    return new Promise((resolve, reject) => {
        const jqxhr = $.post({
            type: 'POST',
            url: URL,
            dataType: 'json',
            success: dataRes => {
                if (dataRes.Error) {
                    reject(new Error(`${dataRes.Message}\n${dataRes.Stack}`));
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



$(() => {
    console.log('Demo started');

    setTimeout(() => {
        const swiper = new Swiper('.swiper', {
            effect: 'cards',
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            shortSwipes: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            noSwipingSelector: 'input,textarea'
        });
    }, 500);



    // $('#SQLStmt').on('keypress', e => {
    //     if (e.which === 13) {
    //         RunSQL();
    //     };
    // });

    // $('#SQLRun').click(() => RunSQL());

    // $('#RecreateTableBtn').click(async () => {
    //     $('#RecreateTableBtn').prop('disabled', true);
    //     const mySpinnerInstanceJQ = CreateSpinnerOnTopOf('#RecreateTableBtn');
    //     try {
    //         const myResults = await FetchPost('/run', {
    //             Action: 'RecreateTable',
    //             SecurityToken: SecurityToken
    //         });
    //     } catch (err) {
    //         alert(err.message);
    //     } finally {
    //         mySpinnerInstanceJQ.remove();
    //         $('#RecreateTableBtn').prop('disabled', false);
    //     };
    // });

    // $('#CreateRows').click(async () => {
    //     $('#CreateRows').prop('disabled', true);
    //     const mySpinnerInstanceJQ = CreateSpinnerOnTopOf('#CreateRows');
    //     try {
    //         const myResults = await FetchPost('/run', {
    //             Action: 'CreateRows',
    //             SecurityToken: SecurityToken,
    //             SQLStmt: $('#SQLStmt').val().trim()
    //         });
    //     } catch (err) {
    //         alert(err.message);
    //     } finally {
    //         mySpinnerInstanceJQ.remove();
    //         $('#CreateRows').prop('disabled', false);
    //     };
    // });

    // let RunTheQueries = false;
    // let QueryCount = 0;
    // let RowCount = 0;

    // let loopedQuerySpinner;

    // $('#RandomQueryStop').prop('disabled', true);

    // $('#RandomQueryStop').click(async () => {
    //     RunTheQueries = false;
    //     if (loopedQuerySpinner) {
    //         loopedQuerySpinner.remove();
    //         loopedQuerySpinner = null;
    //     };
    // });

    // $('#RandomQueryStart').click(async () => {
    //     QueryCount = 0;
    //     RowCount = 0;
    //     RunTheQueries = true;
    //     $('#RandomQueryStart').prop('disabled', true);
    //     $('#RandomQueryStop').prop('disabled', false);
    //     loopedQuerySpinner = CreateSpinnerOnTopOf('#RandomQueryStart');
    //     try {
    //         while (RunTheQueries) {
    //             const myResults = await FetchPost('/run', {
    //                 Action: 'RandomQuery',
    //                 SecurityToken: SecurityToken
    //             });
    //             RowCount += myResults.rows.length;
    //             $('#RandomResultBox').html(`Queries issued: ${QueryCount++}, accumulated rows: ${RowCount}`);
    //         };
    //     } catch (err) {
    //         alert(err.message);
    //     } finally {
    //         RunTheQueries = false;
    //         QueryCount = 0;
    //         $('#RandomQueryStart').prop('disabled', false);
    //         $('#RandomQueryStop').prop('disabled', true);
    //     };
    // });


});