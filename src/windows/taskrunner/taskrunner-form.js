const Form = load.class('form');

class TaskRunnerForm extends Form {

    getSchema() {
        return {
            name: 'taskrunner',
            title: t('Work In Progress') + '...',
            width: 470,
            height: 190,
            center: true,
            resizable: false,
            minimizable: false,
            maximizable: false,
            modal: true
        };
    }

    buildComponents() {
        this.buildComponentsFromSchemaList([{
            className: 'Panel',
            properties: {
                name: 'panelStep',
                alignment: 'none',
                left: 10,
                top: 10,
                width: 450,
                height: 110,
                backgroundColor: '#252525',
                borderRadius: 4,
                borderWidth: 0,
                borderColor: '#FFFFFF',
                borderStyle: 'solid'
            },
            children: [{
                className: 'Label',
                properties: {
                    name: 'labelStepTitle',
                    alignment: 'none',
                    label: 'Label',
                    left: 20,
                    top: 30,
                    width: 410,
                    height: 20,
                    padding: 0,
                    color: '#999',
                    textAlign: 'center',
                    backgroundColor: 'none'
                }
            }, {
                className: 'ProgressBar',
                properties: {
                    name: 'progressBar',
                    alignment: 'none',
                    left: 10,
                    top: 70,
                    width: 430,
                    height: 10,
                    mode: 'indeterminate',
                    value: 50,
                    minValue: 0,
                    maxValue: 100,
                    foregroundColor: '#3498DB',
                    backgroundColor: '#2B2B2B',
                    metaData: ''
                }
            }]
        }, {
            className: 'Button',
            properties: {
                name: 'btnCancel',
                label: 'Cancel',
                hint: '',
                alignment: 'none',
                enabled: true,
                left: 170,
                top: 140,
                width: 130,
                height: 35,
                metaData: ''
            }
        }])
    }

}

module.exports = TaskRunnerForm;
