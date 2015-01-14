/************************************************
 Local storage : retrieve and push updates 
 *************************************************/

var storage = window.localStorage
var schedule = []

/*

"scheduled-items" => [
	"ID" => UniqueID based on current system time
    "name" => STRING,
    "day" => "Mon/Tue.."
    "time" => "hh/mm"
    "backpack" => [ "name" => STRING ], #REPEAT ARRAY ITEMS
    "ringtone" => "filename",
    "notifications" => boolean "true/false" for now*
] #REPEAT ARRAY ITEMS

*/

if(typeof(Storage) !== "undefined") {
	if (localStorage["scheduled-items"]){
		schedule = JSON.parse(storage["scheduled-items"]);
		loadData();
	}
} else {
    alert('Your browser doesn\'t support local storage !')
}

function store(){
	if(typeof(Storage) !== "undefined") {
		storage["scheduled-items"] = JSON.stringify(schedule);
	} else {
	    alert('Your browser doesn\'t support local storage ! These informations will not be saved')
	}
}

function loadData(){
	schedule.forEach(function(entry) {
	    //Add a row corresponding to the item
	    addRow(function(interceptedElement){
	    	el = $(interceptedElement)
	    	el.find('.course-name').val(entry["name"])
	    	el.find('.course-time').val(entry["time"])
	    	el.find('.course-day').val(entry["day"])
	    	el.find('.course-ringtone').val(entry["ringtone"])
	    })
	})
}

//Generate unique ID
function genID(){
	return new Date().getUTCMilliseconds();
}

// Find item in memory
function findItemById(id) {
	for(var i=0; i<= schedule.length; i++){
		if (schedule[i].id === id) {
		  return schedule[i];
		}
	}
	return false
}


/************************************************
 Schedule view 
 *************************************************/


// Activate Backpack modal 
// http://getbootstrap.com/javascript/#modals
$('#modal-backpack').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) 
	var course = button.parents('tr').find('.course-name').val() 

	var modal = $(this)
	modal.find('.modal-title').text('Backpack for course ' + course)
})

$('#modal-ringtone').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) 
	var course = button.parents('tr').find('.course-name').val() 

	var modal = $(this)
	modal.find('.modal-title').text('Ringtone for course ' + course)
})


function addRow(interceptor){
	var elem = document.getElementById('row-blueprint');
	last_row = document.getElementById('add_row')
	var dup = elem.cloneNode(true)
	dup.className = ''
	last_row.parentNode.insertBefore(dup, last_row)
	dirty()
	if (interceptor){
		interceptor(dup)
	}
}

function addBackpackItem(interceptor){
	var elem = document.getElementById('backpack-item-blueprint');
	last_elem = document.getElementById('add_backpack-item')
	var dup = elem.cloneNode(true)
	dup.className = ''
	last_elem.parentNode.insertBefore(dup, last_elem)
	dirty()
	if (interceptor){
		interceptor(dup)
	}
}

function removeLi(what){
	removeElement(what, 'LI')
}

function removeTd(what){
	removeElement(what, 'TD')
}

function removeElement(what, tag_name){
	elem = what
	while(elem.nodeName != tag_name){
		elem = elem.parentNode
	}
	elem.parentNode.removeChild(elem)
	dirty()
}

function selectSound(caller){
	var activeLi = caller
	var items = activeLi.parentNode.childNodes
	for(i=0; i < items.length; i++){
		if (items[i].nodeName == 'LI'){
			items[i].className = "clickable"
		}
	}
	activeLi.className = "clickable active"
}

function playSound(sound){
	var audio = document.getElementById(sound)
	audio.load()
	audio.play()
}



/************************************************
 Data validation and saving
 *************************************************/

 var saved = true

function dirty(){
	saved = false
	$(".save-state").toggleClass('need-save', true)
		.text("Warning ! Data not saved")
}

function saved(bool){
	if (bool){
		$(".save-state").toggleClass('need-save', false)
			.text("Changes saved successfully")
	} else{
		$(".save-state").toggleClass('need-save', true)
			.text("Warning ! Changes not saved")
	}
	saved = true
}

//Validations

function validate(){
	var items = $("#scheduled-items tr")
	var errors = false
	items.each(function(){
		var id = $(this).attr("itemid")

		// Only need to check date ?
		var dates = $(this).find(".course-time")
		var TIME_REGEXP = /\d{1,2}H\d{1,2}/
		dates.each(function(){
			if (!$(this).val().match(TIME_REGEXP)){
				$(this).toggleClass("has-error", true)
				errors = true
			} else{
				$(this).toggleClass("has-error", false)
			}
		})
	})
	if (!errors){
		saveSchedule()
	}
}

function saveSchedule(){
	$("form").submit()
	return true
}



// backpack modal - save
function saveBackpack(){
	var list = $("#items-list")
	var id = list.attr("itemid")
	var item = findItemById(id)
	item["backpack"] = []
	list.find("li input.course-backpack-item").each(function(){
		var itemName = $(this).val()
		if (itemName){
			item.backpack.push()
		}
	})
}

//Save selected ringtone
function saveSelectedRingtone(){
	var id = list.attr("itemid")
	var item = findItemById(id)
	item["ringtone"] = $("#ringtone-selector li.active")[0]
}


