$(() => {

    const $head = $('head');
    const $title = $head.children('title');
    const $body = $('.view-window');

    window.setTitle = title => $title.html(title);
    window.setContent = content => $body.html(content);
    window.addCSS = url => $head.append(`<link rel="stylesheet" href="${url}">`);
    window.addJS = url => $body.append(`<script src="${url}"></script>`);

    window.addCSS(window.view.getStylesURL());
    window.addJS(window.view.getScriptURL());

    window.setTitle(window.meta.title);
    window.setContent(window.view.getHTML());

})
