const Form = load.class('form');

class SplashForm extends Form {

    getSchema() {
        return {
            name: 'app/splash',
            title: 'ElectroStudio',
            width: 310,
            height: 300,
            left: 400,
            top: 120,
            center: true,
            resizable: false,
            minimizable: true,
            maximizable: false,
            modal: false,
            // isDebug: true
        };
    }

    buildComponents() {
        this.buildComponentsFromSchemaList([{
            className: 'Button',
            properties: {
                name: 'btnNewProject',
                label: 'Create New Project...',
                hint: '',
                alignment: 'none',
                enabled: true,
                left: 50,
                top: 50,
                width: 220,
                height: 40,
                metaData: ''
            },
            events: {
                click: 'onBtnNewProjectClick',
            }
        }, {
            className: 'Button',
            properties: {
                name: 'btnLastProject',
                label: 'Open Last Project...',
                hint: '',
                alignment: 'none',
                enabled: false,
                left: 50,
                top: 100,
                width: 220,
                height: 40,
                metaData: ''
            },
            events: {
                click: 'onBtnLastProjectClick',
            }
        }, {
            className: 'Button',
            properties: {
                name: 'btnOpenProject',
                label: 'Open Project...',
                hint: '',
                alignment: 'none',
                enabled: true,
                left: 50,
                top: 150,
                width: 220,
                height: 40,
                metaData: ''
            },
            events: {
                click: 'onBtnOpenProjectClick',
            }
        }, {
            className: 'Button',
            properties: {
                name: 'btnClose',
                label: 'Close ElectroStudio',
                hint: '',
                alignment: 'none',
                enabled: true,
                left: 50,
                top: 200,
                width: 220,
                height: 40,
                metaData: ''
            },
            events: {
                click: 'onBtnCloseClick',
            }
        }])
    }

}

module.exports = SplashForm;
