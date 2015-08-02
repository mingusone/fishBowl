
function rad2deg (radian){
	return radian * (180 / Math.PI);
}

function deg2radian (deg){
	return deg * (Math.PI / 180);
}

//returns facing as [1,-1] from the radians.
//Given theta as radian, give me an array of where the radian hits the circle of radius 1
//Working fine. Tested.
function getCoords(radian){ 
	if (radian === 0) return [1,0];
	if (radian === 0.5) return [0,1];
	if (radian === 1) return [-1,0];
	if (radian === 1.5) return [0,-1];

	//use this later to make things positive or negative
	var quandrant;
	if (radian < 0.5){
	 quandrant = 1; 
	 }
	else if (radian < 1) { 
		quandrant = 2;
		radian -= 0.5;
	}
	else if (radian < 1.5) {
		quandrant = 3;
		radian -= 1;

	}
	else { 
		quandrant = 4;
		radian -= 1.5;
	}

	//Find the adjacent and opposite
	var adj = Math.cos(radian * Math.PI); //Radius is always 1
	var opp = Math.sin(radian * Math.PI);

	//Figure out which is X and which is Y based on quandrant
	var x, y;
	if(quandrant === 1){
		x = adj; 
		y = opp;
	}
	else if(quandrant === 2){
		x = opp * -1;
		y = adj;

	}
	else if(quandrant === 3){
		x = adj * -1;
		y = opp * -1;

	}
	else if(quandrant === 4){
		x = opp;
		y = adj * -1;
	}

	return [x,y];
}


function coords2quad(x1,x2,y1,y2){
	var dX = x2-x1;
	var dY = y2-y1;
	if( dX > 0 && dY > 0 ) return 1;
	if( dX < 0 && dY > 0 ) return 2;
	if( dX < 0 && dY < 0 ) return 3;
	if( dX > 0 && dY < 0 ) return 4;
}

function coords2theta (x1,x2,y1,y2){
	return Math.atan((y2-y1)/(x2-x1))/Math.PI;
}

function getSlope(x1,y1,x2,y2){
	if(x2-x1 === 0) return 999999;
	if(y2-y1 === 0) return 0;
	return ((y2-y1)/(x2-x1));
}

function getQuad(radian){
	var quadrant;
	if (radian < 0.5){
	 quandrant = 1; 
	 }
	else if (radian < 1) { 
		quandrant = 2;
	}
	else if (radian < 1.5) {
		quandrant = 3;

	}
	else { 
		quandrant = 4;
	}
	return quadrant;
}

function getIndexOfHighest(arr){
	var max = arr[0];
	var maxIndex = 0;
	for (var i = 1; i < arr.length; i++) {
	    if (arr[i] > max) {
	        maxIndex = i;
	        max = arr[i];
	    }
	}
	return maxIndex;

}