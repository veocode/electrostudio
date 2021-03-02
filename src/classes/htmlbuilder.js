class HTMLBuilder {

    singleTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

    make(tag, attributes, content = '') {
        const isPairedTag = !this.singleTags.includes(tag);
        const attributesString = attributes.getHTML();

        let html = `<${tag}${attributesString}>`;

        if (isPairedTag) {
            if (content) {
                html += content;
            }
            html += `</${tag}>`;
        }

        return html;
    }

}

module.exports = HTMLBuilder;
