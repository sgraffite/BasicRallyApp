Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        console.log('Tacos are yummy!');
        this._loadData();
    },

    // Load data
    _loadData: function(){
        let myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(store, data, success) {
                    console.log('got data!', data, success);
                    this._loadGrid(store);
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'ScheduleState']
        });
    },

    // Load grid
    _loadGrid: function(store){
        var myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: store,
            columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState'
            ]
        });
        this.add(myGrid);
    }
});
