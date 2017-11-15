/*jslint browser:true */
/*global
   document, event, Image, $
*/
/* 
 * functions for image marks of defects captured
 *
 *
 *
*/

function ImageMarkUp(p_draw_image) {
    "use strict";

    var canvas = document.getElementById("simple_scetch");
    var context = canvas.getContext("2d");
    var captured_image;
    var markup_rectangle = {};
    var markup_number = 0;
    var drag = false;
    var drawcolour = "#f00";
    var init_settings = {
        width: 0,
        height: 0,
        offsetLeft: 0,
        offsetTop: 0,
        image_source: ""
    };
    var rotating = false;
    var img_reload = false;
    var markups = [];   

    function delete_saved_markups() {
        //Delete saved marked areas
        markups.length = 0;
        markup_number = 0;
    }

    function markup_data(p_markup) {
        //Check of anything was passed
        if (p_markup === undefined) {
            //Initialise the object with default data
            return {
                'id': 0,
                'startX': 0,
                'startY': 0,
                'w': 0,
                'h': 0,
                'strokeStyle': '#f00'
            };
        }
        else {
            //Initialise the object passed data
            return {
                'id': p_markup.id,
                'startX': p_markup.startX,
                'startY': p_markup.startY,
                'w': p_markup.w,
                'h': p_markup.h,
                'strokeStyle': p_markup.strokeStyle
            };
            
        }
    }

    function draw_all_defects(p_markups, p_ctx) {
        //
        p_markups.forEach(function (markup) {            
            p_ctx.strokeStyle = markup.strokeStyle;
            p_ctx.strokeRect(markup.startX, markup.startY, markup.w, markup.h);
        });       
    }

    function rotate(p_rotating) {
        if (p_rotating === true) {
            //
            delete_saved_markups();
            captured_image.src = canvas.toDataURL();
        }
    }

    function change_drawcolour(p_drawcolour) {

        //Redraw the the figure using the colour selected
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(captured_image, 0, 0);

        context.strokeStyle = p_drawcolour;
        context.strokeRect(markup_rectangle.startX, markup_rectangle.startY, markup_rectangle.w, markup_rectangle.h);

        draw_all_defects(markups, context);
    }

    function mouseDown(e) {
        markup_rectangle.startX = e.pageX - this.offsetLeft;
        markup_rectangle.startY = e.pageY - this.offsetTop;
        drag = true;
    }

    function mouseUp() {
        drag = false;
    }

    function mouseMove(p_event) {
        if (drag) {

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(captured_image, 0, 0);

            markup_rectangle.w = (p_event.pageX - this.offsetLeft) - markup_rectangle.startX;
            markup_rectangle.h = (p_event.pageY - this.offsetTop) - markup_rectangle.startY;
            context.strokeStyle = drawcolour;
            context.strokeRect(markup_rectangle.startX, markup_rectangle.startY, markup_rectangle.w, markup_rectangle.h);

            draw_all_defects(markups, context);
        }
    }
    function save_marking() {

        //Check if there is something to save
        if (markup_rectangle.startX === undefined || markup_rectangle.startY === undefined || markup_rectangle.w === undefined || markup_rectangle.h === undefined) {
            return;
        }

        markup_number = markup_number + 1;
        markup_rectangle.id = markup_number;
        markup_rectangle.strokeStyle = drawcolour;

        var temp_markup = markup_data(markup_rectangle);

        // Transfer data to save 
        markups.push(temp_markup);
    }

    function refresh(p_refresh) {
        if (p_refresh === true) {
            //
            captured_image.src = init_settings.image_source;         
            delete_saved_markups();
        }
    }

    return {
        init: function (p_Canvas, p_Context) {

            captured_image = new Image();
            captured_image.src = p_draw_image;

            captured_image.onload = function () {
        
                if (rotating === true) {
        
                    var degrees = 0;
                    degrees = (degrees + 90) % 360;                
                        
                    if (degrees === 90 || degrees === 270) {
                        canvas.width = captured_image.height;
                        canvas.height = captured_image.width;
                    } else {
                        canvas.width = captured_image.width;
                        canvas.height = captured_image.height;
                    }
        
                    context.clearRect(0, 0, canvas.width, canvas.height);
        
                    context.save();
        
                    if (degrees === 90 || degrees === 270) {
                        context.translate(captured_image.height / 2, captured_image.width / 2);
                    } else {
                        context.translate(captured_image.width / 2, captured_image.height / 2);
                    }
        
                    context.scale(1, 1);
                    context.rotate(degrees * Math.PI / 180);                
                    context.drawImage(captured_image, -captured_image.width / 2, -captured_image.height / 2);
                    context.restore();
                                        
                    rotating = false;
        
                    captured_image.src = canvas.toDataURL();
        
                    return;
                }        
         
                if (img_reload === true) {
                    //
                    delete_saved_markups();
                    //
                    canvas.width = init_settings.width;
                    canvas.height = init_settings.height;
        
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(captured_image, 0, 0);
        
                    img_reload = false;
                    return;
                }
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(captured_image, 0, 0);
            };          
                        

            if (p_Canvas === null || p_Canvas === undefined || p_Context === null || p_Context === undefined) {
                p_Canvas = document.getElementById("simple_scetch");
                p_Context = p_Canvas.getContext("2d");
            }
            //            
            canvas = p_Canvas;
            context = p_Context;
            
            //Store initial canvasl values
            init_settings.height = canvas.height;
            init_settings.width = canvas.width;
            //
            canvas.addEventListener("mousedown", mouseDown, false);
            canvas.addEventListener("mouseup", mouseUp, false);
            canvas.addEventListener("mousemove", mouseMove, false);
            //Save original source
            init_settings.image_source = captured_image.src;
        },
        rotate: function () {
            rotating = true;
            rotate(rotating);
        },
        change_drawcolour: function (p_new_colour) {

            //Get the colour
            drawcolour = p_new_colour;
            change_drawcolour(drawcolour);            
        },
        save_marking: function () {
            
            save_marking();
        },
        refresh: function () {

            img_reload = true;
            refresh(img_reload);
        }        
    };
}
 
/*******************************************/
var test_canvas = document.getElementById('simple_scetch');
var ctx = test_canvas.getContext('2d');
var g_draw_image = '540x960.jpg';

var qgate_imagemarkup = new ImageMarkUp(g_draw_image);
qgate_imagemarkup.init(test_canvas, ctx);

/**********************************/

$('a[href^="#simple_scetch"]').click(function () {
    "use strict";
    //Get the colour
    var g_colour = $(this).data('color');
    qgate_imagemarkup.change_drawcolour(g_colour);

});

$(".clear_screen").click(function () {
    "use strict";
    qgate_imagemarkup.refresh();
    $("ul.canvas_markup").empty();

});

$("#savemarkup").click(function () {
    "use strict";
    qgate_imagemarkup.save_marking();

});

$("#rotate").click(function () {
    "use strict";
    // rotate the canvas 90 degrees each time the button is pressed
    qgate_imagemarkup.rotate();

});