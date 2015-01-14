$('#late').click(function(){
	var heure_bis = document.getElementById("heure_notif").value;
	var minute_bis = document.getElementById("minute_notif").value;
	var minute_bar = document.getElementById("range").innerHTML;
	var heure = heure_bis+"h";
	var minute = minute_bis +"min";

	if(!minute_bis)
	{
		if(heure_bis)
		{
			window.localStorage.setItem('Heure',heure);
			window.localStorage.setItem('Minute',0);
			window.localStorage.setItem('MinuteB',0);
				
		}
		else
		{
			if(!minute_bar)
			{
				window.localStorage.setItem('MinuteB',minute_bar);
				window.localStorage.setItem('Minute',0);
				window.localStorage.setItem('Heure',0);
				
			}
		}
	}
	else
	{
		window.localStorage.setItem('Minute',minute);
		window.localStorage.setItem('Heure',0);
		window.localStorage.setItem('MinuteB',0);
		
	}

});
