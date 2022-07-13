'use strict';



const SpinnerTemplateID = 'mz-spinner-template';



$(() => {
    $(`<template id='${SpinnerTemplateID}'>
    <div class='lds-spinner'>
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
    </div>
</template>`).appendTo('body');
});



let SpinnerIDCounter = 10000;



function CreateSpinnerOnTopOf(TargetID) {
    const mySpinnerTemplate = document.getElementById(SpinnerTemplateID);
    const mySpinnerInstance = document.importNode(mySpinnerTemplate.content, true);
    const mySpinnerInstanceJQ = $(mySpinnerInstance);
    
    const TargetSpinnerObj = $(TargetID);
    const TargetParent = TargetSpinnerObj.parent();
    TargetParent.css('position','relative');
    TargetParent.append(mySpinnerInstanceJQ);
    const DomObjectJQ = TargetSpinnerObj.siblings(':last');
    DomObjectJQ.attr('id', `${SpinnerTemplateID}${SpinnerIDCounter++}`);
    return DomObjectJQ;
};
