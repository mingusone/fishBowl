$( document ).ready(function(){


var renderer = PIXI.autoDetectRenderer(cageSizeX, cageSizeY,{backgroundColor : 0xFFFFE6});

$('#main').append(renderer.view);

var stage = new PIXI.Container();
var birdTexture = PIXI.Texture.fromImage('images/SQdown.png'); 
var seedTexture = PIXI.Texture.fromImage('images/seed.png'); 

var birdIndex = [];
var seedIndex = [];

///////////////////////////////SET UP GAME OBJECTS HERE///////////////////////////////

var arena = new Cage();

var records = {generation:0};
var NumberOfCombatants = 6;

for(var i = 0; i < NumberOfCombatants; i++){
	var name = "Model " + Math.floor(Math.random() * 10000);
	var randX = Math.floor(Math.random() * cageSizeX);
	var randY = Math.floor(Math.random() * cageSizeY);
	arena.add(new Bird(name, [randX, randY]));
}

var buildSprites = function(){
	stage = new PIXI.Container();
	birdIndex = [];
	seedIndex = [];
	arena.getBirds().forEach(function(currBird){
		var birdSprite = new PIXI.Sprite(birdTexture);
		birdSprite.height = birdSize;
		birdSprite.width = birdSize;
		birdSprite.position.x = currBird.loc[0];
		birdSprite.position.y = currBird.loc[1];
		birdSprite.anchor.x = 0.5;
		birdSprite.anchor.y = 0.5;
		birdSprite.rotation = (currBird.facing) * Math.PI;
		birdSprite.texture = birdTexture;
		birdSprite._id = Math.random(); //My own perosnal ID to keep track of them
		currBird._id = birdSprite._id;
		birdSprite._type = "bird";

		birdIndex.push(birdSprite._id);
		
		stage.addChild(birdSprite);
	})

			var style = {
		    font : '36px Arial bold italic',
		    fill : '#F7EDCA',
		    stroke : '#4a1850',
		    strokeThickness : 5,
		    dropShadow : true,
		    dropShadowColor : '#000000',
		    dropShadowAngle : Math.PI / 6,
		    dropShadowDistance : 6,
		    wordWrap : true,
		    wordWrapWidth : 440
			};

		var richText = new PIXI.Text('Generation: '+records.generation,style);
		richText.x = 30;
		richText.y = 30;

		stage.addChild(richText);
}



var updateSprites = function(){
	arena.getBirds().forEach(function(bird, i){


			if(birdIndex.indexOf(bird._id) === -1){
				var birdSprite = new PIXI.Sprite(birdTexture);
				birdSprite.height = birdSize;
				birdSprite.width = birdSize;
				birdSprite.position.x = currBird.loc[0];
				birdSprite.position.y = currBird.loc[1];
				birdSprite.anchor.x = 0.5;
				birdSprite.anchor.y = 0.5;
				birdSprite.rotation = (currBird.facing) * Math.PI;
				birdSprite.texture = birdTexture;
				birdSprite._id = Math.random(); //My own perosnal ID to keep track of them
				currBird._id = birdSprite._id;
				birdSprite._type = "bird";

				birdIndex.push(birdSprite._id);
				
				stage.addChild(birdSprite);

			} else {

				//Loop through the children and find it.
				for(var j = 0; j < stage.children.length; j++){ 
					var stageChild = stage.children[j];
					var canvassBirdID = stageChild._id;

					if(canvassBirdID === bird._id){ //Find the seed and update the position
						stageChild.position.x = bird.loc[0];
						stageChild.position.y = bird.loc[1];
						stageChild.rotation = bird.facing * Math.PI;
						break; //If see is found, break out of the loop. Save some cycles.
					}
				}
			}
	})
}


var updateSeed = function(){
	var arenaSeedArr = arena.getSeeds();
	var arenaSeedIDs = []; //to be used below to delete bullets that are gone.

	if(arenaSeedArr.length > 0){

		arenaSeedArr.forEach(function(currSeed, i){
			arenaSeedIDs.push(currSeed._id);

			if(seedIndex.indexOf(currSeed._id) === -1){
				var seedSprite = new PIXI.Sprite(seedTexture);
				seedSprite.height = seedSize;
				seedSprite.width = seedSize;
				seedSprite.position.x = currSeed.loc[0];
				seedSprite.position.y = currSeed.loc[1];
				seedSprite.anchor.x = 0.5;
				seedSprite.anchor.y = 0.5;
				seedSprite._id = Math.random(); //My own perosnal ID to keep track of them
				currSeed._id = seedSprite._id;

				seedSprite._type = "seed"

				seedIndex.push(seedSprite._id);
				
				stage.addChild(seedSprite);

			} else {

				//Loop through the children and find it.
				for(var j = 0; j < stage.children.length; j++){ 
					var stageChild = stage.children[j];
					var canvassSeedID = stageChild._id;

					if(canvassSeedID === currSeed._id){ //Find the seed and update the position
						stageChild.position.x = currSeed.loc[0];
						stageChild.position.y = currSeed.loc[1];
						break; //If see is found, break out of the loop. Save some cycles.
					}
				}
			}
		})

		//Remove seeds that no longer exist
		if(arenaSeedArr.length !== seedIndex.length && arenaSeedIDs.length > 0){
			seedIndex.forEach(function (id, seedIndexCounter){ //For every seedID we've indexed in frontend

				if(arenaSeedIDs.indexOf(id) === -1){ //seedID not found in arena
					var stageChildren = stage.children;

					for(var k = 0; k < stageChildren.length; k++){ //Find the seed in stage
						if(id === stageChildren[k]._id){ //If theres a match

							stageChildren.splice(k, 1); //Remove it from stage
							k--;
							seedIndex.splice(seedIndexCounter, 1);
							seedIndexCounter--;
						}
					}

				}
			})
		}
	}
}

buildSprites(arena);

var testBird = arena.getBirds()[0];

var GAMESTATE = 'Stop';

///////////////////////////////SET UP GAME OBJECTS HERE^//////////////////////////////


var animate = function() {
	if(GAMESTATE === 'Play'){
    arena.update();
	}
    updateSprites();
    updateSeed();
    requestAnimationFrame(animate);
    renderer.render(stage);
    //
    // 
    // debugger;
}

// start animating
animate();
var timeCount = 0;

var getFitnessArr = function(birdArr){
	var fitness = [];
	birdArr.forEach(function(bird){
		fitness.push(bird.fitness);
	})
	return fitness;
}

var gamePlay = function(){
	GAMESTATE = 'Play';
}

var gameStop = function(){
	GAMESTATE = 'Stop';
}


$( "#PlayBtn" ).click(function() {
	gamePlay();
});

$( "#StopBtn" ).click(function() {
	gameStop();
}); 


var gameReset = function(){
	arena.resetBirds();
	buildSprites();
	// 
}

$( "#RestartPos" ).click(function() {
	gameStop();
	gameReset();
	gamePlay();
}); 

var eugnBtn = function () {
	GAMESTATE = 'Stop';
	var GAengine = new GeneticAlgorithm();
	var birdsInCage = arena.getBirds();
	GAengine.population = birdsInCage;
	GAengine.fitness = getFitnessArr(birdsInCage);
	GAengine.run(0.6, 0.005, 1);
	GAengine.population.slice(3,NumberOfCombatants-3);

	for(var i = GAengine.population.length; i < NumberOfCombatants; i++){
		var name = "Model " + Math.floor(Math.random() * 10000);
		var randX = Math.floor(Math.random() * cageSizeX);
		var randY = Math.floor(Math.random() * cageSizeY);
		GAengine.population.push(new Bird(name, [randX, randY]));
	}
	
	arena.setBirds(GAengine.population);
	arena.setSeeds([]);
	gameReset();
	GAMESTATE = 'Play';
	records.generation += 1;
	
}

$( "#EugnBtn" ).click(function() {
	eugnBtn();
}); 

$("#Reset").click(function(){
	arena.setBirds([]);
	for(var i = 0; i < NumberOfCombatants; i++){
	var name = "Model " + Math.floor(Math.random() * 10000);
	var randX = Math.floor(Math.random() * cageSizeX);
	var randY = Math.floor(Math.random() * cageSizeY);
	arena.add(new Bird(name, [randX, randY]));
	}
	gameReset();
})


$("#Manual").click(function(){
	arena.getBirds().forEach(function(bird){
		bird.supervised();
	})
})

var autoIntervalID;

$("#Auto").click(function(){
	if(!!autoIntervalID) clearInterval(autoIntervalID);
	autoIntervalID = setInterval(function(){
		eugnBtn();
	}, 20000)

})

$("#StopAuto").click(function(){
	if (!autoIntervalID) return;
	clearInterval(autoIntervalID);
	autoIntervalID = null;

})







/////////////////////////////////////////////////
////////DEBUG STUFF GOES HERE////////////////////
// setInterval(function(){
// 	var seedLength = arena.getSeeds().length;
// 	var birdLength = arena.getBirds().length;
// 	var stageLength = stage.children.length;
// 	console.log("Bullets in the bacK: ", seedLength);
// 	console.log("Birds in the back: ", birdLength);
// 	console.log("Entities in the front: ", stageLength);
// 	console.log("Differences between the 2: ", stageLength - birdLength - seedLength);
	
// }, 500)






})//<---- for the document.ready
