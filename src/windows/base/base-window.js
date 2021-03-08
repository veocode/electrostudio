$(() => {

    const $head = $('head');
    const $headTitle = $head.children('title');
    const $body = $('.window-view');
    const $title = $('.window-title > .title');

    const $btnMinimize = $('.window-title button.minimize');
    const $btnMaximize = $('.window-title button.maximize');
    const $btnClose = $('.window-title button.close');

    $btnMinimize && $btnMinimize.on('click', (event) => {
        event.preventDefault();
        window.minimize();
    });

    $btnMaximize && $btnMaximize.on('click', (event) => {
        event.preventDefault();
        window.maximize();
    });

    $btnClose && $btnClose.on('click', (event) => {
        event.preventDefault();
        window.close();
    });

    window.setTitle = title => $title.html(title) && $headTitle.html(title);
    window.setDOM = $dom => $body.empty().append($dom);
    window.addCSS = url => $head.append(`<link rel="stylesheet" href="${url}">`);
    window.addJS = url => $body.append(`<script src="${url}"></script>`);

    const $formDOM = window.form.getDOM($);

    window.setTitle(window.meta.title);
    window.setDOM($formDOM);

})
