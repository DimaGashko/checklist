;(function() {

   function Store(name) {
      this._createOptions(name);
      this._init();
   }
   
   Store.prototype._init = function() {
      if(!localStorage[this.name]) {
         this.data = {
            todos: [],
            filter: 'all',
         }
         
         this.save();
         return this;
      } 
      
      this.parse();
      return this;
   }
   
   Store.prototype.save = function() {
      try {
         localStorage[this.name] = JSON.stringify(this.data);
      } catch (error) {
         if (error.name === 'QuotaExceededError') {
            console.log(error);
         }
      }
            
      return this;
   }
   
   Store.prototype.parse = function() {
      try {
         var d = JSON.parse(localStorage[this.name]);
         
         var checkData = d.todos && d.filter; 
         if (!checkData) {
            throw new SyntaxError('Отсутствуют необходимые поля');
         }
         
         this.data = d;
      } catch (error) {
         if (error.type === 'SyntaxError') {
            this.data = {
					todos: [],
					filter: 'all',
				}
            this.save();
         }
      }
      
      return this;
   }
   
   Store.prototype._createOptions = function(name) {
      this.name = '' + name;
      
      return this;
   }

   window.Checklist._Store = Store;;
}());