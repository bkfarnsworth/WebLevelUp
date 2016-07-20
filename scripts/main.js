
$('.submit').on('click', function(){

	//get every score and save to db
	$('.category-input').each(function(index, value){
		var $el = $(this);
		var score = $el.val();
		var key = $el.data('key');
		levelUp.saveValue(score, key);
	});
});

$('.submit-category').on('click', function(){
	var value = $('.new-category-input').val()
	levelUp.saveCategory(value);
});

function LevelUp() {
  this.initFirebase();
}

function renderCategory(key, category){
	var categoryName = category.name;
	var category = $('<div></div>');
	var categoryInput = $('<input/>').addClass('category-input');
	category.text(categoryName + ': ');
	category.append(categoryInput);
	category.data('key', key);
	categoryInput.data('key', key);
	$('.categories').append(category);
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
LevelUp.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  // Initiates Firebase auth and listen to auth state changes.
  // this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

LevelUp.prototype.loadCategories = function(){
	// Reference to the /messages/ database path.
	this.categoriesRef = this.database.ref('categories');
	// Make sure we remove all previous listeners.
	this.categoriesRef.off();

	// Loads the last 12 messages and listen for new ones.
	var setMessage = function(data) {
	  var val = data.val();
	  renderCategory(data.key, val);
	}.bind(this);
	this.categoriesRef.on('child_added', setMessage);
	// this.categoriesRef.limitToLast(12).on('child_changed', setMessage);
};

LevelUp.prototype.saveCategory = function(name){
	this.categoriesRef = this.database.ref('categories');
	this.categoriesRef.push({
			name: name,
    	values: []
  }).then(function() {
  	// console.log('DID IT!');
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
};

LevelUp.prototype.saveValue = function(value, key) {
  this.categoryValuesRef = this.database.ref('categories/' + key + '/values');
  this.categoryValuesRef.push({
  	date: new Date().toString(),
  	score: value
  }).then(function() {
  	// console.log('DID IT!');
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
};

window.onload = function() {
  window.levelUp = new LevelUp();
  levelUp.loadCategories();
};