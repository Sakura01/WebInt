var error = $('#error').parent();
		$('input[name="radio-choice"]').change(function() {
			var song = this.value;
			var compare=song.localeCompare("Avicii");
			var ringtone='assets/audio/ticktac.mp3';
			if (compare==0)
			{
				ringtone='assets/audio/wake.mp3';
			}
			var songid=ringtone;
			
			//window.localStorage.setItem('name to get and set value',your variable);
			window.localStorage.setItem('songid',songid);
			window.localStorage.setItem('fileName',0);
			//alert(songid);
		});
			//trigger each x min/hours/sec

		$('input[name="trigger-choice"]').change(function() {
			var triggered = this.value;
			var oneHour=triggered.localeCompare("1h");
			var oneMin=triggered.localeCompare("1min");
			var oneSec=triggered.localeCompare("1s");
			var after = 0,to_seconds = [3600, 60, 1];
			var snooze=triggered.localeCompare("snooze");
			//alarm.addClass('active');
			//Demander au prof
			if(snooze==0)
			{
				alarm_counter=100;
				
			}
			if (oneHour==0)
			{
				//play alarm each 3600s
				after += to_seconds[0] * 1;
				alarm_counter = after;
			}
			if (oneMin==0)
			{
				//play alarm each 60s
				after += to_seconds[1] * 1;
				alarm_counter = after;
			}
			if(oneSec==0)
			{
				//play alarm each 1s
				after += to_seconds[2] * 1;
				alarm_counter = after;
			}
			//window.localStorage.setItem('name to get and set value',your variable);
			//window.localStorage.setItem('trigger',alarm_counter);
		});	
			//Browse for ringtone
		$( "#file_upload" ).change(function() {
			var ringtone=this.files[0];
			
			
			var name='assets/audio/'+ringtone.name;

			var elem = document.getElementById("infoFile");
			
			//window.localStorage.setItem('name to get and set value',your variable);
			
			var data=name.split('.');
			if((data[1].localeCompare("mp3")==0)||(data[1].localeCompare("ogg")==0))
			{
				window.localStorage.setItem('fileName',name);
				window.localStorage.setItem('songid',0);
				elem.value = name;
			}
			else
			{
				error.fadeIn();
			}
			
		});
		error.click(function(){
			error.fadeOut();
		});
