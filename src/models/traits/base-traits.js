const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    PositionTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty('left'),
                new Props.IntegerProperty('top'),
            ]
        }
        appendAttributes(attributes, values) {
            values.left == 0 || attributes.add('style', `left: ${values.left}px`);
            values.top == 0 || attributes.add('style', `top: ${values.top}px`);
        }
    },

    SizeTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.RelativeIntegerProperty('width'),
                new Props.RelativeIntegerProperty('height'),
            ]
        }
        appendAttributes(attributes, values) {
            values.width == 0 || attributes.add('style', `width: ${values.width}px`);
            values.height == 0 || attributes.add('style', `height: ${values.height}px`);
        }
    },

    NameTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('name'),
            ]
        }
        appendAttributes(attributes, values) {
            if (values.name) {
                attributes.add('id', values.name);
            }
        }
    },

    TitleTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('title', 'Default', false),
            ]
        }
    },

    LabelTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('label', 'Default', false),
            ]
        }
    },

    TextTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('text', '', false),
            ]
        }
    },

    HintTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('hint', '', false),
            ]
        }
        appendAttributes(attributes, values) {
            values.hint && attributes.add('title', values.hint);
        }
    },

    AlignmentTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ListProperty('alignment', ['none', 'client', 'top', 'bottom', 'left', 'right'], 'none'),
            ]
        }
        isAllowComponentResizing(values) {
            return values.alignment && values.alignment != 'client';
        }
        isAllowComponentDragging(values) {
            return !this.isAlignmentSet(values);
        }
        isAlignmentSet(values) {
            return values.alignment && values.alignment != 'none';
        }
        appendAttributes(attributes, values) {
            if (values.alignment != 'none') {
                attributes.add('class', `align-${values.alignment}`);
            }
        }
    },

    EnabledTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.BooleanProperty('enabled'),
            ]
        }
        appendAttributes(attributes, values) {
            values.enabled || attributes.add('disabled', 'disabled');
        }
    },

    IconTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('icon', 'bolt', true),
            ]
        }
    },

    TextAlignTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ListProperty('textAlign', ['auto', 'left', 'center', 'right', 'justify'], 'auto'),
            ]
        }
        appendAttributes(attributes, values) {
            values.textAlign && values.textAlign != 'auto' && attributes.add('style', `text-align: ${values.textAlign}`);
        }
    },

    TextColorTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ColorProperty('color', 'auto', false),
            ]
        }
        appendAttributes(attributes, values) {
            values.color && values.color != 'none' && attributes.add('style', `color: ${values.color}`);
        }
    },

    ForegroundColorTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ColorProperty('foregroundColor', 'auto', false),
            ]
        }
    },

    BackgroundColorTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ColorProperty('backgroundColor', 'auto', false),
            ]
        }
        appendAttributes(attributes, values) {
            values.backgroundColor && !['auto', 'none'].includes(values.backgroundColor) && attributes.add('style', `background: ${values.backgroundColor}`);
        }
    },

    PaddingTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty('padding', 0),
            ]
        }
        appendAttributes(attributes, values) {
            values.padding && attributes.add('style', `padding: ${values.padding}px`);
        }
    },

    BorderTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty('borderRadius', 0),
                new Props.IntegerProperty('borderWidth', 0),
                new Props.ColorProperty('borderColor', '#000000'),
                new Props.ListProperty('borderStyle', ['solid', 'dashed', 'dotted', 'inset', 'outset'], 'solid'),
            ]
        }
        appendAttributes(attributes, values) {
            if (values.borderWidth) {
                attributes.add('style', `border: ${values.borderStyle} ${values.borderWidth}px ${values.borderColor}`);
            }

            values.borderRadius && attributes.add('style', `border-radius: ${values.borderRadius}px`);
        }
    },

    ToggleableTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.BooleanProperty('toggleable', false, false),
            ]
        }
    },

    MetaDataTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('metaData'),
            ]
        }
    },

    ActiveIndexTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty('activeIndex'),
            ]
        }
    }

}
