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
        window.size.minimize();
    });

    $btnMaximize && $btnMaximize.on('click', (event) => {
        event.preventDefault();
        window.size.maximize();
    });

    $btnClose && $btnClose.on('click', (event) => {
        event.preventDefault();
        window.close();
    });

    window.setTitle = title => $title.html(title) && $headTitle.html(title);
    window.setContent = content => $body.html(content);
    window.addCSS = url => $head.append(`<link rel="stylesheet" href="${url}">`);
    window.addJS = url => $body.append(`<script src="${url}"></script>`);

    window.setTitle(window.meta.title);
    window.setContent(window.handler.getHTML());

})
