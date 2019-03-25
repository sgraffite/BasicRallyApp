Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        console.log('Tacos are yummy!');
        //this._loadData();
        this._loadIterations();
    },

    // Load iterations
    _loadIterations: function(){
        this.iterationsComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
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
        this.add(this.iterationsComboBox);
    },

    // Load data
    _loadData: function(){
        let selectedIteration = this.iterationsComboBox.getRecord().get('_ref');
        console.log('selectedIteration', selectedIteration);
        this.store = Ext.create('Rally.data.wsapi.Store', {
            model: 'Defect',
            autoLoad: true,
            filters:[
                {
                    property: 'Iteration',
                    operation: '=',
                    value: selectedIteration
                }
            ],
            listeners: {
                load: function(store, data, success) {
                    console.log('got data!', data, success);
                    this._loadGrid();
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
        });
    },

    // Load grid
    _loadGrid: function(){
        this.grid = Ext.create('Rally.ui.grid.Grid', {
            store: this.store,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration'
            ]
        });
        this.add(this.grid);
    }
});
