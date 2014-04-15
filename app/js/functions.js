function getEnd(end) {
	var scope = this;
	scope.today = Date.now();
	var dd = scope.today.getDay();
	var mm = scope.today.getMonth()+1; //January is 0!
	var yyyy = scope.today.getFullYear();
	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	return  dd+'/'+mm+'/'+yyyy;

} 