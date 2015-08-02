var bulletSpeed = [6,6];
var birdSpeed = [3,3];
var birdTurnRate = 0.01;
var birdFoVRate = 0.025;
var birdSize = 50;
var seedSize = 10;
var cageSizeX = 800;
var cageSizeY = 600;

var Bullet = function(name, loc, facing){
	this.loc = [];
	this.loc.push(loc[0]); //[x,y]
	this.loc.push(loc[1]);
	this.facing = getCoords(facing); //[x,y] Facing here is not radian.
	this.name = name;
}

Bullet.prototype.update = function(){ //Bullets can self update its location. No need to manually do it.
		this.loc[0] += (this.facing[0] * bulletSpeed[0]);
		this.loc[1] += (this.facing[1] * bulletSpeed[1]);
	}


var Cage = function(){
	var birds = [];
	var	bullets = [];

	this.add = function(bird){
		birds.push(bird);
	}



	this.cycleBirds = function(){
		if(birds.length === 0) return;
		birds.forEach(function(bird, i){
			var sightings = getThingsInFOV(bird.loc, bird.facing, bird.FoV, bird.name)
			var mindThoughts = bird.think(sightings[0],sightings[1]);

			//get the index of the highst thought and act upon it.
			var actionNumber = getIndexOfHighest(mindThoughts);

			if (actionNumber === 0){//Move bird in the direction its facing
				var facing = getCoords(bird.facing);
				bird.loc[0] += facing[0]*birdSpeed[0];
				bird.loc[1] += facing[1]*birdSpeed[1];
				bird.loc = checkEdges(bird.loc); //Make sure birds dont go offscreen.
			}
			else if (actionNumber === 1){
				bird.facing += birdTurnRate;
				if(bird.facing > 2) bird.facing -= 2;
			}
			else if (actionNumber === 2){
				bird.facing -= birdTurnRate;
				if(bird.facing < 0) bird.facing += 2;
			}
			else if (actionNumber === 3){
				if(bird.hasShot >= 1){
				bullets.push(new Bullet(bird.name, bird.loc, bird.facing));
				bird.hasShot = 0;
				}

			}
			else if (actionNumber === 4){
				bird.FoV -= birdFoVRate;
				if(bird.FoV > 0.5) bird.FoV = 0.5;
				if(bird.FoV < 0) bird.FoV = 0.01;
			}
		})
	}

	this.cycleBullets = function(){
		if(bullets.length === 0) return;

		for(var z = 0; z < bullets.length; z++){
			var currSeed = bullets[z];
			currSeed.update();
				
			if(seedHitEdge(currSeed.loc)){
				bullets.splice(z,1);
				z--;
			}
		}
	}

	this.checkCollisions = function(){
		if(birds.length === 0) return;
		birds.forEach(function(bird, birdIndex){

			if(bullets.length === 0) return;
			bullets.forEach(function(seed, seedIndex){

				if (seed.name === bird.name) return;

				var seedCenter = [seed.loc[0] + (seedSize/2), seed.loc[1] + (seedSize/2)];

				if(seedCenter[0]>bird.loc[0] &&
					seedCenter[0]<(bird.loc[0]+birdSize) &&
					seedCenter[1]>bird.loc[1] &&
					seedCenter[1]<(bird.loc[1]+birdSize)){
						//Bird got hit. 
						bird.gotHit();
						//delete bullet
						bullets.splice(seedIndex, 1);
						//if bird has no hp, delete bird.
						if(bird.HP <= 0){
							bird.loc = [NaN, NaN];
							var seedName = seed.name;
							for(var iz = 0; iz < birds.length; iz++){
								var bird1 = birds[iz]; //bird1 because bird is used above.
								var birdName = bird1.name;
								if(seedName === birdName){
									bird.fitness -= 0.001;
									bird1.fitness += 0.010;
									break;
								}
							}

						} 
				}
			})
		})
	}
	this.update = function(cycles){
		
		if(cycles){
			for(var cycleCounter = 0; cycleCounter < cycles; cycleCounter++){
				if(birds.length === 0) break;
				this.cycleBirds();
				this.cycleBullets();
				this.checkCollisions();
			}
		}

		this.cycleBirds();
		this.cycleBullets();
		this.checkCollisions();
	}

	//Return an array of booleans (in the for of 1 and 0)
	//{ enemy: true, bullet: false } => [1, 0]
	//"B" IS Y INTERCEPT
	function getThingsInFOV (loc, rad, FoV, name){
		var thingsInFoV = [0,0]; //Start it off as false,false. No enemy, no bullets. 

		var visionQuad = getQuad(rad);

		var facing = getCoords(rad);
		var fovSlope = getSlope(loc[0],loc[1],facing[0],facing[1]);


		var sharpSlope = (function(){
			var newRad = rad + FoV/2;
			var newFacing = getCoords(newRad);
			var newSlope = getSlope(loc[0],loc[1],newFacing[0],newFacing[1]);
			return newSlope;
		})()

		var sharpB = loc[1] - (loc[0] * sharpSlope);

		var dullSlope = (function(){
			var newRad = rad - FoV/2;
			var newFacing = getCoords(newRad);
			var newSlope = getSlope(loc[0],loc[1],newFacing[0],newFacing[1]);
			return newSlope;
		})()

		var dullB = loc[1] - (loc[0] * dullSlope);
		//console.log(dullB, loc[1], loc[0], dullSlope)

		//Check  birds
		birds.forEach(function(scanBird, i){
			if (scanBird.name === name) return; //Same bird? skip it.
				var quad = coords2quad(loc[0],loc[1],scanBird.loc[0],scanBird.loc[1]);

				var scanTheta = Math.atan((scanBird.loc[1]-loc[1])/(scanBird.loc[0]-loc[0]))/Math.PI

				if(quad === 1){
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[0] = 1;
				}
				if(quad === 2){
					scanTheta *= -1;
					scanTheta = 0.5 - scanTheta + 0.5; //or 1 - scanTheta but this is more visual.
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[0] = 1;
				}
				if(quad === 3){
					scanTheta = scanTheta + 1; 
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[0] = 1;
				}
				if(quad === 4){
					scanTheta *= -1;
					scanTheta = 0.5 - scanTheta + 1.5; //-0.5 to get the deltaTheta in local quadrant. Then add 1.5 to get absolute diff.

					//THIS PART IS BROKEN. Because of how theta resets when it it hits 0,0 on the right hand side. It works unless 
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[0] = 1; //THIS IS A WEIRD ONE. INCOMPLETE
				}

		})


		bullets.forEach(function(scanBullet, i){
			if (scanBullet.name === name) return; //Same bird? skip it.
				var quad = coords2quad(loc[0],loc[1],scanBullet.loc[0],scanBullet.loc[1]);

				var scanTheta = Math.atan((scanBullet.loc[1]-loc[1])/(scanBullet.loc[0]-loc[0]))/Math.PI

				if(quad === 1){
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[0] = 1;
				}
				if(quad === 2){
					scanTheta *= -1;
					scanTheta = 0.5 - scanTheta + 0.5; //or 1 - scanTheta but this is more visual.
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[0] = 1;
				}
				if(quad === 3){
					scanTheta = scanTheta + 1; 
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[0] = 1;
				}
				if(quad === 4){
					scanTheta *= -1;
					scanTheta = 0.5 - scanTheta + 1.5; //-0.5 to get the deltaTheta in local quadrant. Then add 1.5 to get absolute diff.

					//THIS PART IS BROKEN. Because of how theta resets when it it hits 0,0 on the right hand side. It works unless 
					if(scanTheta < rad + FoV/2 && scanTheta > rad - FoV/2) thingsInFoV[1] = 1; //THIS IS A WEIRD ONE. INCOMPLETE
				}
		})
		return thingsInFoV;
	}

	function checkEdges(loc){
		if(loc[0] < 0) loc[0] = 0;
		if(loc[0] + birdSize > cageSizeX) loc[0] = cageSizeX - birdSize;
		if(loc[1] < 0) loc[1] = 0;
		if(loc[1] + birdSize > cageSizeY) loc[1] = cageSizeY - birdSize;
		return loc;
	}

	function seedHitEdge(loc){
		if(loc[0] < 0){
			return true;
		}
		else if(loc[0] + seedSize > cageSizeX){
			return true;
		}
		if(loc[1] < 0){
			return true;
		}
		else if(loc[1] + seedSize > cageSizeY){
			return true;
		}
		return false;
		
	}
	this.getBirds = function(){
		return birds;
	}
	this.setBirds = function(inBirds){
		birds = inBirds;
	}

	this.getSeeds = function(){
		return bullets;
	}

	this.setSeeds = function(inSeeds){
		bullets = inSeeds;
	}


	this.resetBirds = function(){
		birds = birds.map(function(bird){
			var name = "Model " + Math.floor(Math.random() * 10000);
			bird.name = name;
			bird.HP = 3;
			var randX = Math.floor(Math.random() * cageSizeX);
			var randY = Math.floor(Math.random() * cageSizeY);
			bird.loc = [randX, randY]
			return bird;
		})
	}
}
