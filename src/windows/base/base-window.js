$(() => {

    const $title = $('head > title');
    const $body = $('.view-window');
    const $head = $('head');

    $title.html(window.meta.title);
    $body.html(window.view.getHTML());
    $head.append(`<link rel="stylesheet" href="../${window.meta.name}/${window.meta.name}-window.css">`);

})
