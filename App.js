Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:[
        {
            xtype: 'container',
            itemId: 'pulldown-container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        }
    ],
    launch: function() {
        console.log('Tacos are yummy!');
        this._loadIterations();
    },

    // Load iterations
    _loadIterations: function(){
        let iterationsComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            itemId: 'iteration-combobox',
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            width: 400,
            listeners: {
                ready: function(comboBox){
                    this._loadSeverities();
                },
                select: function(comboBox, records) {
                    console.log(records);
                    this._loadData();
                },
                scope: this
            },
        });
        let container = this.down('#pulldown-container');
        container.add(iterationsComboBox);
    },

    // Load severities
    _loadSeverities: function(){
        let severitiesComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            itemId: 'severity-combobox',
            fieldLabel: 'Severity',
            labelAlign: 'right',
            model: 'Defect',
            field: 'Severity',
            listeners: {
                ready: function(comboBox){
                    this._loadData();
                },
                select: function(comboBox, records) {
                    console.log(records);
                    this._loadData();
                },
                scope: this
            },
        });

        let container = this.down('#pulldown-container');
        container.add(severitiesComboBox);
    },

    _getFilters: function(iterationValue, severityValue){
        let iterationFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Iteration',
            operation: '=',
            value: iterationValue
        });

        let severityFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Severity',
            operation: '=',
            value: severityValue
        });

        return iterationFilter.and(severityFilter);
    },

    // Load data
    _loadData: function(){
        let selectedIteration = this.down('#iteration-combobox').getRecord().get('_ref');
        let selectedSeverity = this.down('#severity-combobox').getRecord().get('value');
        console.log(selectedSeverity)
        console.log('selectedIteration', selectedIteration);



        let filters = this._getFilters(selectedIteration, selectedSeverity);
        if(this.store){
            this.store.setFilter(filters);
            this.store.load();
            return;
        }

        this.store = Ext.create('Rally.data.wsapi.Store', {
            model: 'Defect',
            autoLoad: true,
            filters: filters,
            listeners: {
                load: function(store, data, success) {
                    if(!this.grid){
                        this._createGrid();
                    }
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
        });
    },

    // Load grid
    _createGrid: function(){
        this.grid = Ext.create('Rally.ui.grid.Grid', {
            store: this.store,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration'
            ]
        });
        this.add(this.grid);
    }
});
