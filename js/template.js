;(function() {

   function Template() {
      
   }
   
   Template.prototype.getHTML = function(type, dataObject) {
      if (typeof dataObject !== 'object') {
         return '';
      } else if (type === 'item') {
         return this._getHTMLItem(dataObject);
      }
   }
   
   Template.prototype._getHTMLItem = function(dataObject) {
      var checked = '', textCompleted = '';
      
      if (dataObject.completed) {
         checked = 'checked';
         textCompleted = 'checklist__item-text-through';
         
      }
   
      return '<div class="checklist__item-checkbox">'
         +       '<label class="checklist__checkbox-completed-label">'
         +         '<input type="checkbox" class="checklist__checkbox-completed"'  
         +            ' ' + checked + '>' 
         +          '<span></span>'
         +       '</label>' 
         +    '</div>' 
         +    '<div class="checklist__item-content">' 
         +       '<div class="checklist__item-text ' + textCompleted + '">'  
         +          dataObject.title 
         +       '</div>' 
         +       '<input type="text" class="checklist__item__input-edit">' 
         +    '</div>' 
         +    '<div class="checklist__item-remove"></div>'
   }

   window.Checklist._Template = Template;
}());