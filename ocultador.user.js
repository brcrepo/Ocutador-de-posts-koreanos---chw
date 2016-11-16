// ==UserScript==
// @name         chw - ocultador de post koreanos
// @namespace    chw.korea.orochimaru
// @version      0.1
// @description  oculta los posts koreanos del foro y le da scroll infinito
// @author       BRC
// @match        http://www.chw.net/foro/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==
var proximaPag = getNextPage(document);

function filtrar(pagina){

    var posts = $(pagina).find('ol.threads li.threadbit');

    $(posts).each(function(){

        var titulo = $(this).find('a.title').text();
        var isKoreano = titulo.match(/[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]+/g);

        if(isKoreano){

            this.remove();
        }
    });

    return posts;

}


function getNextPage(pagina){
    return $(pagina).find('a[rel="next"]').attr('href');
}


filtrar(document);

$(function(){

    $(window).on("scroll",function scrollHand(event){

        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100){

            $(this).off(event);

            $.ajax({
                url: proximaPag,
                dataType: 'html',
                success: function(html) {

                    proximaPag= getNextPage(html);
                    postDeProximaPagina  = filtrar(html);
                    $(postDeProximaPagina).hide().appendTo('ol.threads').fadeIn("slow");

                },
                complete: function(){ $(window).on("scroll",scrollHand); }
            });


        }
    });
});