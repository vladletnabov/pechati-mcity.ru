/**
 * Created by Skif on 24.10.2018.
 */
var sqstampFixed = null;
var sqstampUnfixed = null;
var sqstamp_data = {
    fixed: {
        name:"Стандартный размер штампа",
        default: 2,
        minscale: 1,
        maxscale: 7,
        sizing: [
            {
                size: 1,
                productid: 7,
                width: 20,
                height: 10,
                price: 200
            },
            {
                size: 2,
                productid: 2,
                width: 90,
                height: 30,
                price: 200
            },
            {
                size: 3,
                productid: 12,
                width: 40,
                height: 20,
                price: 200
            },
            {
                size: 4,
                productid: 4,
                width: 50,
                height: 20,
                price: 300
            },
            {
                size: 5,
                productid: 4,
                width: 50,
                height: 40,
                price: 500
            },
            {
                size: 6,
                productid: 4,
                width: 80,
                height: 50,
                price: 700
            },
            {
                size: 7,
                productid: 4,
                width: 150,
                height: 90,
                price: 900
            }
        ]

    },
    unfixed: {
        name:"Произвольный размер штампа",
        default: 0,
        minscale: 10,
        maxscale: 200,
        sizing: [
            {
                size:0,
                productid: 10,
                width: 50,
                height: 20,
                price: .09
            },
        ]
    }
};


$(document).ready(function() {

    $('.stamps-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:false,
        //animateOut: 'fadeOut',
        dots: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    });

    sqstampFixed = SVG('sqstamp-fixed').size(200, 200);
    sqstampUnfixed = SVG('sqstamp-unfixed').size(200, 200);

    full_recalc_rstamps('.stamp-item');

    get_data_sqstamp('.sqstamp-item');

    $('.sqstamp-item li[data-type]').click(function () {
        var tab = $(this);
        setAmountStamp(tab, true);
    });

    $('.sqstamp-item .btn-add-qty').click(function () {
        var qty = parseInt($(this).data("addqty"));
        var input = $(this).closest('.grp-qty').find('input');
        if (input.length==0){
            return false;
        }
        on_change_input(input, qty);
        var tab = $('.sqstamp-item li.active[data-type]');
        setAmountStamp(tab, true);
        /*set_qty(main, $(input).val());
        calc_amount(main);*/
    });

    $('.stamp-item .btn-add-qty').click(function () {
        var main = $(this).closest('.stamp-item');
        var qty = parseInt($(this).data("addqty"));
        var input = $(this).closest('.grp-qty').find('input');
        if (input.length==0){
            return false;
        }
        on_change_input(input, qty);
        set_qty(main, $(input).val());
        calc_amount(main);
    });
    $('.order-button').click(function () {
        var main = $(this).closest('.stamp-item');
        var productid = $(main).data('productid');
        var productname = $(main).data('productname');
        var price = $(main).data('price');
        var qty = $(main).data('qty');
        var amount = $(main).data('amount');
        //console.log($(main).data("productname") + ", " + $(main).data("qty") + ", " + $(main).data("price") + " = " + $(main).data("amount"));
        //alert($(main).data("productname") + ", " + $(main).data("qty") + ", " + $(main).data("price") + " = " + $(main).data("amount"));
        var windowid = 'createOrder_' + productid;
        var parentid = '';
        var template = noteModalWnd;
        //console.log('noteid: ' + noteid);
        var buttons = createButtons([
            {
                name: 'Закрыть',
                class: 'btn-outline-default close-and-exit',
            },
            {
                name: 'ЗАКАЗАТЬ',
                class: 'btn-success close-and-register-order',
            }
        ]);
        var body = sendRequestToManager;
        var data = {
            id: windowid,
            OTHERDATA: 'data-parentid="' + parentid +'"' + 'data-productid="'+ productid + '" ' + ' data-price="' + price +'" data-productname="' + productname+ '" data-qty="' + qty +'" data-amount="' + amount +'"',
            MODAL_HEADER: 'Оформить заказ',
            BUTTON_WINDOW: buttons,
            MODAL_DATA_TEMPLATE: body,
            SIZE_BS_WINDOW: 'bg-wnd-black'
        };
        template = setWndParams(data, template);
        createModalWindow(windowid, parentid, template);
    });


    $('body').on('click','.close-and-register-order', function () {
        //console.log('try to save note');
        var windowid =$(this).closest('.modal').attr('id');
        var parentid =$(this).closest('.modal').attr('data-parentid');
        var emptyReqFields = notSettedRequiredFields(windowid, 'data-fieldname', 'data-required');
        var classname = 'border-danger';
        removeNotSettedFieldsBorder(windowid, 'data-fieldname', classname);
        if (emptyReqFields.length>0){
            //console.log('Not setted fields...');
            $.each(emptyReqFields, function (index, field) {
                //console.log(field);
                $('#' + windowid + ' [data-fieldname="' + field + '"]').addClass(classname);
            });
            return false;
        }
        var orderData = getOrderDataFromWnd(windowid);
        //console.log(orderData);
        $('#' + windowid).preloader({
            // loading text
            text: '',
            // from 0 to 100
            percent: '',
            // duration in ms
            duration: '',
            // z-index property
            zIndex: 10000,
            // sets relative position to preloader's parent
            setRelative: false

        });
        sendOrderDataToServer(windowid, orderData);
    });

    $('body').on('click','.close-and-exit', function () {
        //console.log('try to close');
        var windowid =$(this).closest('.modal').attr('id');
        var parentid =$(this).closest('.modal').attr('data-parentid');
        //console.log({windowid: windowid, parentid:parentid});
        $('#' + windowid).modal('hide');
        if (typeof parentid!=='undefined'){
            if(parentid.localeCompare('')!=0){
                $('#' + parentid).modal('show');
            }
        }
    });
    $('.price-item').click(function () {
        var main = $(this).closest('.stamp-item');
        set_items_cheked(main,'.price-item', false);
        set_item_checked($(this), true);
        set_item_data(main,$(this));
    });
});

function get_data_sqstamp(sqstampitem){

    var data = sqstamp_data;
    console.log(data);
    set_default_data(data, sqstampitem);
    createAllSliders(data);

}
function set_default_data(data, sqstampitem){
    //var tabs = $(sqstampitem).find('li[data-type]');
    $.each(data, function (key,value) {
        var tab = $(sqstampitem).find('li[data-type=' + key +']');
        var size = null;
        switch (key) {
            case 'fixed':
                var dflt = value.default;
                size = getSizingBySizeID(dflt, value.sizing);
                set_sqstamp_tab_data(tab, size);
                break;
            case 'unfixed':
                size = value.sizing[0];
                set_sqstamp_tab_data(tab, size);
                break;
            default:
                return false;
        }
    });
}

function set_sqstamp_tab_data(tab, data) {
    $(tab).data('height', data.height);
    $(tab).data('width', data.width);
    $(tab).data('productid', data.productid);
    $(tab).data('price', data.price);
    if($(tab).data('type').localeCompare('unfixed')==0){
        var price = parseInt(data.height) * parseInt(data.width) * parseFloat(data.price);
        $(tab).data('price', price);
    }

}

function createAllSliders(data){
    $.each(data, function (key,value) {
        var sliderID='#slider-' + key;
        var sliderMin=value.minscale;
        var sliderMax=value.maxscale;
        var sliderStep = 1;
        var defaultSizeID = value.default;
        var defaultSize = getSizingBySizeID(defaultSizeID, value.sizing);
        console.log(sliderID);
        if (key.localeCompare('fixed')==0){
            var sliderValue = value.default;
            var sliderSizeLabelID = "#amount-" + key;
            createSlider(sliderID, sliderValue, sliderStep, sliderMin, sliderMax, sliderSizeLabelID);

            drawStampSVG(sqstampFixed, defaultSize.width, defaultSize.height, $(sliderSizeLabelID).val());
        }
        else{
            var sliderValue = value.sizing[0].width;
            var sliderSizeLabelID = "#amount-" + key;
            createSlider(sliderID, sliderValue, sliderStep, sliderMin, sliderMax, sliderSizeLabelID);
            sliderID='#slider-vertical-' + key;
            sliderValue = value.sizing[0].height;
            //sliderSizeLabelID = "#amount-vertical-" + key;
            createSlider(sliderID, sliderValue, sliderStep, sliderMin, sliderMax, sliderSizeLabelID);
            drawStampSVG(sqstampUnfixed, defaultSize.width, defaultSize.height, $(sliderSizeLabelID).val());
        }
    });
}

function drawStampSVG(svg, width, height,  txt, font, multiplier){
    txt = txt || 'XXxXX';
    font = font|| {fill: 'navy', family: 'Arial', size: 14 };
    multiplier = multiplier || 2;
    width = width * multiplier;
    height = height * multiplier;
    if (parseInt(width)<60){font.size=6}
    svg.clear();
    svg.size(width, height);
    /*stroke: #646464;
    stroke-width:1px;
    stroke-dasharray: 2,2;
    stroke-linejoin: round;*/
    svg.rect(width, height).attr({ fill: '#fff', stroke: 'navy', 'stroke-width': 4 });
    var imgText = svg.text(txt);
    imgText.move(width/2, (height/2)-parseInt(font.size)/2).font({
        'text-anchor':   'middle',
        'alignment-baseline': 'middle',
        'fill': font.fill
    });
}

function getSizingBySizeID(id, sizing){
    var result = sizing[0];

    $.each(sizing, function (index, value) {
        if (parseInt(value.size)==parseInt(id)){
            result = value;
        }
    });

    return result;
}

function createSlider(sliderID, sliderValue, sliderStep, sliderMin, sliderMax, sliderSizeLabelID) {
    /*console.log('---------------------');
    console.log(sliderID);
    console.log(sliderValue);
    console.log(sliderStep);
    console.log(sliderMin);
    console.log(sliderMax);
    console.log(sliderSizeLabelID);*/
    var orient = "horizontal";
    var re = /vertical/i

    if (sliderID.match(re)){
        orient = "vertical";
    }

    var tab = getTabFromElement(sliderSizeLabelID);
    $( sliderID ).slider({
        orientation: orient, //"vertical",
        height:200,
        value:sliderValue,
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        slide: function( event, ui ) {
            //$( sliderSizeLabelID ).val( ui.value + 'мм');
            setStampData(sliderID, ui.value);
            setSliderSizeLabelValue(sliderSizeLabelID);
            if ($(tab).data('type').localeCompare('fixed')==0){
                drawStampSVG(sqstampFixed, $(tab).data('width'), $(tab).data('height'), $(sliderSizeLabelID).val());
            }
            else{
                drawStampSVG(sqstampUnfixed, $(tab).data('width'), $(tab).data('height'), $(sliderSizeLabelID).val());
            }

        }
    });
    //$( sliderSizeLabelID ).val( $( sliderID ).slider( "value" )  + 'мм');
    setSliderSizeLabelValue(sliderSizeLabelID);
    setAmountStamp(tab);
}

function setStampData(sliderID, sliderValue) {
    var tab  = getTabFromElement(sliderID);
    var type = $(tab).data('type');
    var price =0;
    var productid=0;
    var height = 0;
    var width  = 0;
    if (type.localeCompare('fixed')==0){
        var sizeData = null;
        $.each(sqstamp_data.fixed.sizing, function (index, data) {
            if (parseInt(data.size)==parseInt(sliderValue)){
                sizeData = data
            }
        });
        console.log(sizeData);
        if (sizeData==null){
            return false;
        }
        price  = sizeData.price;
        height = sizeData.height;
        width  = sizeData.width;
        productid = sizeData.productid;
    }
    else{
        var sizeData = sqstamp_data.unfixed.sizing[0];
        var sizeType = $(sliderID).data('field');
        if (sizeType.localeCompare('width')==0){
            width = sliderValue;
            height = $(tab).data('height');
        }
        else{
            height = sliderValue;
            width = $(tab).data('width');
        }
        var square = parseInt(height)*parseInt(width);
        price = (parseFloat(sizeData.price) * parseFloat(square)).toFixed();
        productid = sizeData.productid;
    }
    $(tab).data('height',    height);
    $(tab).data('width',     width);
    $(tab).data('price',     price);
    $(tab).data('productid', productid);
    console.log('height: ' + $(tab).data('height') +', width: ' + $(tab).data('width') + ', price: ' + $(tab).data('price') + ', productid: ' + $(tab).data('productid'));
    setAmountStamp(tab);
}

function setAmountStamp(tab, force){
    force = force|| false;
    if (($(tab).hasClass('active')==false) && (force==false)){
        return false;
    }
    var sqstamp = $(tab).closest('.sqstamp-item');
    var qty = $(sqstamp).find('.amount-order .grp-qty input');
    var price = $(tab).data('price');
    var amount = parseInt($(qty).val()) * parseFloat(price);
    $('.sqstamp-item .amount-order .amount-total').text(amount);

}

function setSliderSizeLabelValue(sliderSizeLabelID) {
    var tab = getTabFromElement(sliderSizeLabelID);
    var height = $(tab).data('height');
    var width = $(tab).data('width');
    var text = width + 'x' + height + 'мм';
    $(sliderSizeLabelID).val(text);

}

function getTabFromElement(element) {
    var parent = $(element).closest('.tab-pane');
    var type = $(parent).data('type');
    return $(parent).closest('.sqstamp-item').find('li[data-type="' + type +'"]');
}

function sendOrderDataToServer(windowid, orderData){

    var data = {
        'messageData': 'Ошибка передачи данных',
        'messageStatus': false,
        'AC_QOC_REG_ORDER': {
            'createOrder': false,
            'orderNumber': null,
            'newCustomer': true,
            'customerID':  null,
            'errorMessage':'Ошибка получения данных',
            'BODY_TMPL': '<div>Заказ зарегистрирован</div>'
        }
    };

    // get rescponce from server
    $('#' + windowid).preloader('remove');
    var status = data.messageStatus;

    if (JSON.parse(status) == false){
        $('#'+windowid + ' .error-info').removeClass('display-none');
        $('#'+windowid + ' .error-info p').text(data.messageData);
        return false;
    }
    var buttons = createButtons([
        {
            name: 'Закрыть',
            class: 'btn-default close-and-exit',
        }
    ]);
    //console.log(data.AC_QOC_REG_ORDER);
    var body = data.AC_QOC_REG_ORDER.BODY_TMPL;
    $('#' + windowid).modal('hide');
    $('#' + windowid).detach();
    var template = noteModalWnd;
    var infoWindowID = windowid + '_orderInfo_' + data.orderNumber;
    var dataWnd = {
        id: infoWindowID,
        OTHERDATA: 'class="bg-wnd-black" ',
        MODAL_HEADER: 'Заказ оформлен',
        BUTTON_WINDOW: buttons,
        MODAL_DATA_TEMPLATE: body,
        SIZE_BS_WINDOW: 'bg-wnd-black'
    };
    template = setWndParams(dataWnd, template);
    //console.log(windowid);
    createModalWindow(infoWindowID,'', template);


}

function getOrderDataFromWnd(windowid){
    var result = {};
    $.each($('#' + windowid + ' [data-fieldname]'), function (index, field) {
        result[$(field).data('fieldname')] = $(field).val();
    });
    $.each($('#' + windowid).data(), function(index, value){
        result[index] = value;
    });
    result['bs.modal'] = false;
    return result;
}

function full_recalc_rstamps(itemclass){
    itemclass = itemclass|| '.stamp-item';
    var stamps = $('.stamps-carousel').find(itemclass);

    $.each($(stamps), function (index, item) {
        var main = $(item);
        var input = $(item).find('input');
        var qty = 0;

        on_change_input(input, qty);
        set_qty(main, $(input).val());
        calc_amount(main);
    });
}

function set_item_data(main, item) {
    var productid = $(item).data("productid");
    var productname = $(item).data("productname");
    var price = $(item).data("price");

    $(main).data("productid", productid);
    $(main).data("productname", productname);
    $(main).data("price", price);

    calc_amount(main);

}

function set_items_cheked(main, itemclass, check) {
    itemclass = itemclass||'.price-item';
    check= check|| false;
    $.each($(main).find(itemclass),function (ind,item) {
        set_item_checked(item, check);
    })
}

function set_item_checked(item, check){
    check=check|| false;
    var addclass= 'item-checked';
    //$(item).data('checked', check);
    if (check){
        $(item).addClass(addclass)
    }
    else{
        $(item).removeClass(addclass);
    }
}

function set_qty(main, qty) {
    $(main).data("qty", qty);
}

function on_change_input(input, addqty){
    addqty = parseInt(addqty)||0;
    var current = parseInt($(input).val());
    var result = current+addqty;
    if (result < 1){
        $(input).val(1);
    }
    else{
        $(input).val(result);
    }

}

function calc_amount(main){
    var qty=parseInt($(main).data("qty"))||0;
    var price = parseFloat($(main).data("price"))||0;
    var discount = 0;
    var result = parseInt(parseFloat(qty)*parseFloat(price) - parseFloat(discount));
    /*console.log("QTY: " + qty);
    console.log("PRICE: " + price);
    console.log("DISCOUNT: " + price);
    console.log("RESULT: " + result);*/

    set_amount_total(result, main, '.amount-total');
    return result;
}

function set_amount_total(amount, main, span) {
    amount = amount || 0;
    main = main || '.card';
    span = span || '';

    if (span.localeCompare('')==0){
        return false;
    }
    //console.log($(main).find(span).length);
    if ($(main).find(span).length==0){
        return false;
    }
    var format = String(amount).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
    $(main).find(span).text(format);
    set_amount(main, amount);
}
function set_amount(main, amount) {
    $(main).data('amount', amount);
}
var noteModalWnd = '<div id="{{id}}" class="modal fade" data-backdrop="static" data-keyboard="false" data-focus="true" {{OTHERDATA}}>' +
    '    <div class="modal-dialog {{SIZE_BS_WINDOW}}">' +
    '        <div class="modal-content  wnd-info-bg">' +
    '            <div class="modal-header modal-header-center">' +
    '                <h2 class="modal-title">{{MODAL_HEADER}}</h2>' +
    '            </div>' +
    '            <div class="modal-body">' +
    '<div class="container-fluid">' +
    '        <!-- Контейнер, в котором можно создавать классы системы сеток -->' +
    '    {{MODAL_DATA_TEMPLATE}}' +
    '</div>'+
    '        </div>' +
    '            <div class="modal-footer">' +
    '                {{BUTTON_WINDOW}}' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>' ;

var sendRequestToManager = '<div class="input-group field-data"><div class="input-group-addon"><i class="fa fa-user-o"></i></div><input class="form-control message-name" name="message-title" data-fieldname="customername" data-required="true" placeholder="Иванов Иван"/></div>' +
    '<div class="input-group field-data"><div class="input-group-addon"><i class="fa fa-phone"></i></div><input class="form-control message-phone" name="message-phone" data-fieldname="customerphone" data-required="true" placeholder="+7(999)888-77-66"/></div>' +
    '<div class="input-group field-data"><div class="input-group-addon"><i class="fa fa-envelope-o"></i></div><input class="form-control message-email" name="message-email" data-fieldname="customeremail" data-required="true" placeholder="ivan@ivanov.ru"/></div>' +
    '<div class="form-send-value-400 {{display-field}}"> <label class="file_upload"> <span class="button">Выбрать</span> <mark>Файл не выбран</mark> <input type="file" name="message-file" data-fieldname="customerattach" nameelement="Вложение"> </label> </div>' +
    '<div><textarea class="form-control message-content field-data" name="message-content" data-fieldname="customertext" placeholder="Сообщение"></textarea></div>' + '<div class="error-info display-none"><h2>Ошибка регистрации заказа</h2><p></p></div>';

function setWndParam(key, val, tmpl){
    key = "\{\{"+key+"\}\}";
    tmpl = tmpl.replace(new RegExp(key,'g'),val);
    return tmpl;
}

function setWndParams(data, tmpl){
    /*
     * data {key: val, key2: val2}
     * */
    $.each(data, function (key,val) {
        tmpl = setWndParam(key,val, tmpl);
    });
    return tmpl;
}

function createModalWindow(windowid, parentid, template){
    /*
     * на основе готового HTML кода выводит модальное окно.
     * */
    if (parentid.localeCompare('')!=0){
        $(('#' + parentid)).modal('hide');
    }
    $('#' + windowid).detach();
    $("body").append(template);
    //$('#' + windowid).modal('show');
    $('#' + windowid).modal({backdrop:'static'});
}

function createButtons(data){
    var result = '';
    $.each(data, function(index, button){
        var new_btn = '<span class="btn {{class}}" role="button"> {{name}} </span>'; //href="#"
        new_btn = setWndParams(button, new_btn);
        result = result + new_btn;
    });
    return result;
}

function removeNotSettedFieldsBorder(windowid, selector, classname){
    //console.log('removeNotSettedFieldsBorder');
    classname = classname || 'not-setted-req-field';
    var fields = $('#' + windowid + ' [' + selector + ']');
    $.each($(fields), function (index, field) {
        $(field).removeClass(classname);
    });
}
function notSettedRequiredFields(windowid, selector, reqselector) {
    /*
     * windowid - ID окна
     * selector - селектор по которому будут искаться поля
     * reqselector -  селектор опредлеляющий обязательность заполнения
     * */
    var result =[];
    var inputs = $('#' + windowid + ' input[' + selector + '][' + reqselector + '="true"]');
    if($(inputs).length>0){
        $.each($(inputs),function (index, input) {
            if (isEmpty($(input).val())){
                var field = $(input).attr(selector);
                result.push(field);
                //console.log('inputs: ' + field);
            }
        });
    }
    var selects = $('#' + windowid + ' select[' + selector + '][' + reqselector + '="true"]');
    if($(selects).length>0){
        $.each($(selects),function (index, input) {
            if (isEmpty($(input).val())){
                var field = $(input).attr(selector);
                result.push(field);
                //console.log('inputs: ' + field);
            }
        });
    }
    var textareaes = $('#' + windowid + ' textarea[' + selector + '][' + reqselector + '="true"]');
    //console.log(textareaes);
    if($(textareaes).length>0){
        $.each($(textareaes),function (index, input) {
            if (isEmpty($(input).val())){
                var field = $(input).attr(selector);
                result.push(field);
                //console.log('inputs: ' + field);
            }
        });
    }

    return result;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}