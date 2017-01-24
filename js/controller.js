;(function() {

   Controller = function(model, view) {
      this._createOptions(model, view);
      this._init();
      this._initEvents();
   }
   
   Controller.prototype._initEvents = function() {
      this.view.addEvent('addItem', function(title) {
         this.model.addItem(title, this.addItem.bind(this));
         this._init();
      }.bind(this));
      
      this.view.addEvent('completedChange', function(id, status) {
         this.model.editStatus(id, status);
         
         setTimeout(function() {
            this._init()
         }.bind(this), 200);
      }.bind(this));
      
      this.view.addEvent('removeItem', function(id, itemElement) {
         this.model.removeItem(id);
         this.view.removeElement(itemElement);
         this._init();
      }.bind(this));
      
      this.view.addEvent('completedAll', function(status) {
         this.model.editStatusAll(status);
         this._init();
      }.bind(this));
      
      this.view.addEvent('clearCompleted', function(status) {
         this.model.clearComplited();
         this._init();
      }.bind(this));
      
      this.view.addEvent('editItem', function(item, text, input) {
         input.value = text.innerText;
         this.view.toEditItem(item);
      }.bind(this), function(item, id, newTitle, text) {
         this.view.outEditItem(item);
         this.model.editItem(id, newTitle, function() {
             text.innerText = newTitle;
         });
      }.bind(this));
      
      this.view.addEvent('filterAll', function() {
         this._init('all');
      }.bind(this))
      
      this.view.addEvent('filterCompleted', function() {
         this._init('completed');
      }.bind(this))
      
      this.view.addEvent('filterActive', function() {
         this._init('active');
      }.bind(this))
      
      return this;
   }
   
   Controller.prototype.addItem = function(todoObject) {
      this.view.render(todoObject);
      this.allChecks();
   }

   Controller.prototype._init = function(filterType) {
      var todos = this.model.getTodosFilter(filterType);
      
      this.view.clearAll();
      this.view.renderAll(todos);
      this.view.setFilter(this.model.getFilterType());
      this.allChecks();
      
      return this;
   }
   
   Controller.prototype.allChecks = function() {
      this.checkHaveTodos();
      this.checkCompletedAll();
      this.updateItemsLeft();
   }
   
   Controller.prototype.updateItemsLeft = function() {
      var noCompleed = this.model.filter('noCompleted')
      this.view.updateItemsLeft(noCompleed.length);
      
      return this;
   }
   
   Controller.prototype.checkCompletedAll = function() {
       if (!this.model.filter('noCompleted').length) {
         this.view.el.complettedAll.checked = true;
      } else {
         this.view.el.complettedAll.checked = false;
      }
      
      return this;
   }
   
   Controller.prototype.checkHaveTodos = function() {
      if (this.model.getTodos().length) {
         this.view.addHaveTodosClass();
      } else {
         this.view.removeHaveTodosClass();
      }
      
      return this;
   }
   
   Controller.prototype._createOptions = function(model, view) {
      this.model = model;
      this.view = view;
      
      return this;
   }
   
   window.Checklist._Controller = Controller;
}());