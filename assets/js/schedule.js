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
	    	var el = $(interceptedElement)
	    	var debug = entry["id"]
	    	el.attr('itemid', entry["id"])
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
	for(var i=0; i< schedule.length; i++){
		if (String(schedule[i].id) === String(id)) {
		  return schedule[i];
		}
	}
	return false
}


/************************************************
 Schedule view 
 *************************************************/


// Activate Backpack modal 
$('#modal-backpack').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) 
	var scheduledItem = button.parents('tr')
	var itemid = scheduledItem.attr('itemid')
	var course = scheduledItem.find('.course-name').val() 

	var modal = $(this)
	modal.find('.modal-title').text('Backpack for course ' + course)
	//Give the modal the itemid of the called attribute
	modal.find('#items-list').attr('itemid', itemid)
	var inMem = findItemById(itemid)
	if (inMem["backpack"]){
		for(var i=0; i < inMem["backpack"].length; i++){
			addBackpackItem(function(intercepted){
				var text = $(intercepted).find('.course-backpack-item')
				text.val(inMem["backpack"][i])
			})
		}
	}
})

// Activate ringtone modal
$('#modal-ringtone').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) 
	var scheduledItem = button.parents('tr')
	var itemid = scheduledItem.attr('itemid')
	var course = scheduledItem.find('.course-name').val() 

	var modal = $(this)
	modal.find('.modal-title').text('Ringtone for course ' + course)

	//Give the modal the itemid of the called attribute
	modal.find('#ringtone-selector').attr('itemid', itemid)
})


function addRow(interceptor){
	var elem = $('#row-blueprint');
	var list = $('#scheduled-items')
	var dup = elem.clone(true)
	var id = genID()
	dup.removeAttr('id')
	dup.toggleClass("blueprint", false)
	dup.toggleClass('scheduled-item', true)
	//IMPORTANT : attach an itemid to the newly created row, and create in memory
	dup.attr('itemid', id)
	list.append(dup)

	if (interceptor){
		interceptor(dup)
	} else{
		dirty()
		schedule.push({id: id, notifications: false })
	}
}

function removeRow(what){
	var id = $(what).parents('tr').attr('itemid')
	var itemInMem = findItemById(id)
	schedule.splice(schedule.indexOf(itemInMem))
	removeTr(what)
	store()
}

function addBackpackItem(interceptor){
	var elem = $('#backpack-item-blueprint');
	last_elem = $('#add_backpack-item')
	var dup = elem.clone(true)
	dup.toggleClass('blueprint', false)
	dup.removeAttr('id')
	dup.insertBefore(last_elem)
	if (interceptor){
		interceptor(dup)
	}else{
		dirty()
	}
}

function removeLi(what, dirty){
	removeElement(what, 'LI', false)
}

function removeTr(what){
	removeElement(what, 'TR')
}

function removeElement(what, tag_name, need_save){
	elem = what
	while(elem.nodeName != tag_name){
		elem = elem.parentNode
	}
	elem.parentNode.removeChild(elem)
	if (need_save !== false){dirty()}
}

function removeNotification(what){
	removeLi(what, false)
}

function selectSound(caller){
	var activeLi = $(caller)
	var items = activeLi.parents("#ringtone-selector").children('li')
	items.toggleClass("active", false)
	activeLi.toggleClass("active", true)
	dirty('ringtone')
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

/* Check for real-time modifications 
	Reversibility not implemented 
	(ie. if data changed back to what is was, will still show warning) */
function dirty(whatVariable){
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
		var TIME_REGEXP = /\d{1,2}H\d{0,2}/
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
		$(".save-state").toggleClass('need-save', false)
		.text("Saved !")
		saveSchedule()
	} else{
		$(".save-state").toggleClass('need-save', true)
		.text("Time with format xxHmm !")
	}
}

// Save to local Storage !
function saveSchedule(){
	saveBaseParams()
	store()

	$("form").submit()
	return true
}

/* 	Save information from the main window : Day, Time, course name in the memory
	Should be called ONLY after validating params */
function saveBaseParams(){
	var items = $("#scheduled-items tr")

	items.each(function(){
		var itemid = $(this).attr("itemid")
		var storedItem = findItemById(itemid)
		
		// Day of the Week
		var day = $(this).find(".course-day")
		storedItem["day"] = day.val();

		// Course name
		storedItem["name"] = $(this).find(".course-name").val()

		// Time (remember it has )
		storedItem["time"] = $(this).find(".course-time").val()

	})

}



/* backpack modal - save */
function saveBackpack(){
	var list = $("#items-list")
	var id = list.attr("itemid")
	var item = findItemById(id)
	item["backpack"] = []
	list.find(".course-backpack-item").each(function(){
		var itemName = $(this).val()
		if (itemName && itemName !== ""){
			item["backpack"].push(itemName)
		}
	})
	store()
}

//Save selected ringtone
function saveSelectedRingtone(){
	var list = $(this).parents("#ringtone-selector")
	var id = list.attr("itemid")
	var item = findItemById(id)
	item["ringtone"] = list.find("li.active")[0]
}


