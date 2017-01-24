;(function(){
	
	function Checklist(name, root) {
      this._createOptions(name, root);
      this.create();
   }
   
   Checklist.prototype.create = function() {
      this.storage = new Checklist._Store(this.name);
      this.template = new Checklist._Template();
		
		this.model = new Checklist._Model(this.storage);
      this.view = new Checklist._View(this.template, this.root);
      this.controller = new Checklist._Controller(this.model, this.view);
      
      return this;
   }
   
   Checklist.prototype._createOptions = function(name, root) {
      this.root = root;
      this.name = this._namePrefix + name;
      
      return this;
   }
   
   Checklist.prototype._namePrefix = 'checklist-';
	
	window.Checklist = Checklist;
	
}());