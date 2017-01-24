;(function() {

   function View(template, root) {
      this._createOptions(template, root);
      this._getHTMLElements();
   }
   
   View.prototype.renderAll = function(todos) { 
      for (var i = 0; i < todos.length; i++) {
         this.render(todos[i]);
      }
      
      return this;
   }
   
   View.prototype.render = function render(todo) {
      var html = this.template.getHTML('item', todo);
      
      var item = document.createElement('div');
      item.className = this.CLASSES.item;
      item.setAttribute(this.ATTR.id, todo.id);
      item.innerHTML = html;
      
      this.el.body.appendChild(item);
      
      this.el.newTodo.value = '';
      
      return this;
   }
   
   View.prototype.addEvent = function(event, handler, handler2) {
      if (event === 'addItem') {
         this.el.newTodo.addEventListener('keyup', function(event) {
            if (event.keyCode === this.KEYS.enter) {
               handler(this.el.newTodo.value);
            }            
         }.bind(this));
         
      } else if (event === 'completedChange') {
         this.el.root.addEventListener('click', function(event) {
            var targ = event.target;
            
            if (this.hasClass(targ, this.CLASSES.completed)) {
               var item = targ.closest('.' + this.CLASSES.item);
               var id = item.getAttribute(this.ATTR.id);
               
               this.changeTextClass(item, targ.checked);
               handler(id, targ.checked);
            }
         }.bind(this));
         
      } else if (event === 'removeItem') {
         this.el.root.addEventListener('click', function(event) {
            var targ = event.target;
            
            if (this.hasClass(targ, this.CLASSES.remove)) {
               var item = targ.closest('.' + this.CLASSES.item);
               var id = item.getAttribute(this.ATTR.id);
               handler(id, item);
            }
         }.bind(this));
         
      } else if (event === 'completedAll') {
         this.el.complettedAll.addEventListener('click', function(event){
            handler(event.target.checked);
         }.bind(this));
         
      } else if (event === 'clearCompleted') {
         this.el.clearCompleted.addEventListener('click', function(event){
            handler();
         }.bind(this));
         
      } else if (event === 'editItem') {
         this.el.root.addEventListener('dblclick', function(event) {
            var targ = event.target;
            if (this.hasClass(targ, this.CLASSES.text)) {
               var item = targ.closest('.' + this.CLASSES.item);
               var id = item.getAttribute(this.ATTR.id);
               var input = item.getElementsByClassName(this.CLASSES.inputEdit)[0];
               
               handler(item, targ, input);
               
               input.addEventListener('blur', function blur() {
                  input.removeEventListener('blur', blur);
                  handler2(item, id, input.value, targ);
               }.bind(this))
               
               input.addEventListener('keyup', function keyup(event) {
                  input.removeEventListener('keyup', keyup);
                  if(event.keyCode === this.KEYS.enter) {
                     handler2(item, id, input.value, targ);
                  }
               }.bind(this));
            }
         }.bind(this));
         
      } else if (event === 'filterAll') {
         this.el.filterAll.addEventListener('click', function() {
            handler();
            this.setFilter('all');
         }.bind(this));
         
      } else if (event === 'filterActive') {
         this.el.filterActive.addEventListener('click', function() {
            handler();
            this.setFilter('active');
         }.bind(this));
         
      } else if (event === 'filterCompleted') {
         this.el.filterCompleted.addEventListener('click', function() {
            handler();
            this.setFilter('completed');
         }.bind(this));
         
      }
      
      return this;
   }
   
   View.prototype.toEditItem = function(item) {
      item.classList.add(this.CLASSES.itemEdit);
      item.getElementsByClassName(this.CLASSES.inputEdit)[0].focus();
   }
   
   View.prototype.outEditItem = function(item) {
      item.classList.remove(this.CLASSES.itemEdit);
   }
   
   View.prototype.updateItemsLeft = function(n) {
      this.el.itemLeft.innerText = n;
      
      return this;
   }
   
   View.prototype.clearAll = function() {
      this.el.body.innerText = '';
   }
   
   View.prototype.changeTextClass = function(item, status) {
      var textElem = item.getElementsByClassName(this.CLASSES.text)[0];
      
      if(status) {
         textElem.classList.add(this.CLASSES.textCompleted);
      } else {
         textElem.classList.remove(this.CLASSES.textCompleted);
      }
      
      return this;
   }
   
   View.prototype.setFilter = function(filterType) {
      var className = this.CLASSES.filterSelected;
   
      this.el.filterAll.classList.remove(className);
      this.el.filterActive.classList.remove(className);
      this.el.filterCompleted.classList.remove(className);
      
      if (filterType === 'completed') {
         this.el.filterCompleted.classList.add(className);
      } else if (filterType === 'active') {
         this.el.filterActive.classList.add(className);
      } else {
         this.el.filterAll.classList.add(className);
      }    
   }
   
   View.prototype.removeHaveTodosClass = function() {
      this.el.root.classList.remove(this.CLASSES.rootWithContents);
      
      return this;
   }
   
   View.prototype.addHaveTodosClass = function() {
      this.el.root.classList.add(this.CLASSES.rootWithContents);
      
      return this;
   }

   View.prototype._getHTMLElements = function() { 
      this.addElement('complettedAll');
      this.addElement('newTodo');
      this.addElement('body');
      this.addElement('itemLeft');
      this.addElement('filterAll');
      this.addElement('filterActive');
      this.addElement('filterCompleted');
      this.addElement('clearCompleted');
   }
   
   View.prototype.addElement = function(name) {
      if (typeof this.el !== 'object') {
         this.el = {}
      }
      
      if (this.el.root) {
         this.el[name] = this.el.root.
            getElementsByClassName(this.CLASSES[name])[0];
      } 
      
      return this;
   }
   
   View.prototype.removeElement = function(element) {
      this.el.body.removeChild(element);
      
      return this;
   }
   
   View.prototype._createOptions = function(template, root) {
      this.el = {} //this.el.* - html elements
   
      this.template = template;
      this.el.root = root;
      
      return this;
   }
   
   View.prototype.hasClass = function(element, className) {
      return ~element.className.search(className);
   }
   
   View.prototype.CLASSES = {
      root: 'checklist',
      rootWithContents: 'checklist-with_contents',
      complettedAll: 'checklist__completed_all',
      newTodo: 'checklist__new_todo',
      body: 'checklist__body',
      item: 'checklist__item',
      itemEdit: 'checklist__item-edit',
      inputEdit: 'checklist__item__input-edit',
      completed: 'checklist__checkbox-completed',
      textCompleted: 'checklist__item-text-through',
      text: 'checklist__item-text',
      remove: 'checklist__item-remove',
      itemLeft: 'checklist__item_last-val',
      filterAll: 'checklist_filter-all',
      filterActive: 'checklist_filter-active',
      filterCompleted: 'checklist_filter-completed',
      filterSelected: 'checklist_filter-selected',
      clearCompleted: 'checklist__clear-complited',
   }
   
   View.prototype.ATTR = {
      id: 'data-checklist-id'
   }
   
   View.prototype.KEYS = {
      enter: 13,
      esc: 27,
   }

   window.Checklist._View = View;
}());