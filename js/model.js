;(function() {
   
   function Model(storage) {
      this._createOptions(storage);
   }
   
   Model.prototype.addItem = function(title, callback) {
      var title = title.trim();
      
      if (!title) {
         return this;
      }
      
      callback = callback || function() {};
         
      var newItem = {
         title: title,
         completed: false,
         id: Date.now(),
      }
      
      this.getTodos().push(newItem);
      this.storage.save();
      callback(newItem);
      
      return this;
   }
   
   Model.prototype.editItem = function(id, newTitle, handler) {
      var newTitle = newTitle.trim();
      var item = this.getItem(id);
      
      if (!newTitle || !item ) {
         return this;
      }
      
      item.title = newTitle;
      this.storage.save();
      handler();
      
   }
   
   Model.prototype.editStatus = function(id, newStatus, callback) {
      var item = this.getItem(id);
      
      if(!item) {
         return this;
      }
      
      item.completed = newStatus;
      this.storage.save();
      
      return this;
   }
   
   Model.prototype.editStatusAll = function(newStatus) {
      var todos = this.getTodos();
      
      for (var i = 0; i < todos.length; i++) {
         todos[i].completed = newStatus;
      }
      
      this.storage.save();
      
      return this;
   }
   
   Model.prototype.removeItem = function(id, callback) {
      var todos = this.getTodos();
      
      for (var i = 0; i < todos.length; i++) {
         if (todos[i].id == id) {
            todos.splice(i, 1);
            break;
         }
      }
      
      this.storage.save();
      
      return this;
   }
   
   Model.prototype.clearComplited = function() {
      this.filter('completed').forEach(function(item) {
         this.removeItem(item.id);
      }.bind(this));
   }
   
   Model.prototype.filter = function(type) {
      return this.getTodos().filter(function(item) {
         if (type === 'completed') {
            return item.completed === true;
         } else if (type = 'noCompleted') {
            return item.completed === false;
         }
      });
   }
   
   Model.prototype.getItem = function(id) {
      var todos = this.getTodos();
      
      for (var i = 0; i < todos.length; i++) {
         if (todos[i].id == id) {
            return todos[i]; 
         }
      }
      
      return false;
   }
   
   Model.prototype.getTodos = function(filterType) {
      return this.storage.data.todos;
   }
   
   Model.prototype.getTodosFilter = function(filterType) {
      var todos = this.storage.data.todos;
      
      filterType = filterType || this.storage.data.filter;
      this.storage.data.filter = filterType;
      this.storage.save();
      
      if (filterType === "completed") {
         var completed = 'true';
      } else if (filterType === 'active') {
         var completed = 'false';
      } else {
         return todos;
      }
      
      var completed = (filterType === 'completed');
      
      return todos.filter(function(item) {
         return item.completed === completed;
      });
   }
   
   Model.prototype.getFilterType = function() {
      return this.storage.data.filter;
   }
   
   Model.prototype._createOptions = function(storage) {
      this.storage = storage;
      
      return this;
   }

   window.Checklist._Model = Model;
}());