// ==UserScript==
// @name         chw - ocultador de post koreanos
// @namespace    chw.korea.orochimaru
// @version      0.4
// @description  oculta los posts koreanos/chinos del foro y le da scroll infinito
// @author       BRC
// @match        http://www.chw.net/foro/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==
var proximaPag = getNextPage(document);
var contenedorDePost = window.location.href.match("www.chw.net/foro/search.php") ? 'ol.searchbits ':'ol.threads ';

function filtrar(pagina){

    var posts = $(pagina).find(contenedorDePost+ 'li.threadbit');
    var postFiltrados = [];

    $(posts).each(function(index,value){

        var titulo = $(this).find('a.title').text();
        var isKoreano = titulo.match(/[\uAC00-\uD7AF]+/g);
        var isChino = titulo.match(/[\u4e00-\u9fff]+/g);

        if(isKoreano || isChino ){

            console.log(titulo);
            $(this).remove();

        }else{
            postFiltrados.push(this);
        }
    });

    return postFiltrados;

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
                    var postDeProximaPagina  = filtrar(html);
                    $(postDeProximaPagina).hide().appendTo(contenedorDePost).fadeIn("slow");

                },
                complete: function(){ $(window).on("scroll",scrollHand); }
            });

        }
    });
});
